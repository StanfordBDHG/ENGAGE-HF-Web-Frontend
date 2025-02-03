//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import {
  FHIRAllergyIntoleranceCriticality,
  FHIRAllergyIntoleranceType,
  UserType,
} from "@stanfordbdhg/engagehf-models";
import { groupBy } from "es-toolkit";
import { limit, orderBy, query, where } from "firebase/firestore";
import { AllergyType } from "@/modules/firebase/allergy";
import { getCurrentUser, refs } from "@/modules/firebase/app";
import {
  appointmentsQueries,
  parseAppointment,
} from "@/modules/firebase/appointment";
import { type FHIRAllergyIntolerance } from "@/modules/firebase/models";
import { mapAuthData } from "@/modules/firebase/user";
import { getDocsData, type ResourceType } from "@/modules/firebase/utils";
import { queryClient } from "@/modules/query/queryClient";
import {
  type UserData,
  userOrganizationQueryOptions,
} from "@/modules/user/queries";
import { labsObservationCollections } from "@/routes/~_dashboard/~patients/clientUtils";

const getUserClinicians = async () => {
  const { user } = await getCurrentUser();
  let usersQuery = query(
    refs.users(),
    where("type", "in", [UserType.clinician, UserType.owner]),
  );
  if (user.type === UserType.owner || user.type === UserType.clinician) {
    usersQuery = query(
      usersQuery,
      where("organization", "==", user.organization),
    );
  }
  const users = await getDocsData(usersQuery);
  return mapAuthData(
    { userIds: users.map((user) => user.id) },
    ({ auth }, id) => ({
      id,
      displayName: auth.displayName,
      email: auth.email,
    }),
  );
};

export const getFormProps = async () => ({
  clinicians: await getUserClinicians(),
  organizations: await queryClient.ensureQueryData(
    userOrganizationQueryOptions(),
  ),
});

export const getMedicationsData = async () => {
  const medicationClasses = await getDocsData(refs.medicationClasses());
  const medicationsDocs = await getDocsData(refs.medications());

  const prefix = "medicationClasses";

  const getMedications = medicationsDocs.map(async (doc) => {
    const medicationClassExtension = doc.extension?.find((extension) =>
      extension.valueReference?.reference.startsWith(prefix),
    );
    const medicationClassId =
      medicationClassExtension?.valueReference?.reference.slice(
        prefix.length + 1,
      );

    const drugsDocs = await getDocsData(refs.drugs(doc.id));
    const dosageInstruction = doc.extension
      ?.find(
        (extension) =>
          extension.valueMedicationRequest &&
          extension.url.endsWith("/targetDailyDose"),
      )
      ?.valueMedicationRequest?.dosageInstruction?.at(0);

    return {
      id: doc.id,
      name: doc.code?.coding?.at(0)?.display ?? "",
      medicationClassId,
      dosage: {
        frequencyPerDay: dosageInstruction?.timing?.repeat?.period ?? 1,
        quantity:
          dosageInstruction?.doseAndRate?.at(0)?.doseQuantity?.value ?? 1,
      },
      drugs: drugsDocs
        .map((drug) => ({
          id: drug.id,
          medicationId: doc.id,
          medicationClassId,
          name: drug.code?.coding?.at(0)?.display ?? "",
          ingredients:
            drug.ingredient?.map((ingredient) => {
              const name =
                ingredient.itemCodeableConcept?.coding?.at(0)?.display ?? "";
              const unit = ingredient.strength?.numerator?.unit ?? "";
              const strength =
                (ingredient.strength?.numerator?.value ?? 1) /
                (ingredient.strength?.denominator?.value ?? 1);
              return {
                name,
                strength,
                unit,
              };
            }) ?? [],
        }))
        .sort((a, b) => {
          const name = a.name.localeCompare(b.name);
          return name === 0 ?
              (a.ingredients.at(0)?.strength ?? 0) -
                (b.ingredients.at(0)?.strength ?? 0)
            : name;
        }),
    };
  });

  const formattedMedications = await Promise.all(getMedications);
  const medicationsByClass = groupBy(
    formattedMedications,
    (medication) => medication.medicationClassId ?? "",
  );

  const medications = medicationClasses.map((medicationClass) => ({
    id: medicationClass.id,
    name: medicationClass.name,
    medications: medicationsByClass[medicationClass.id] ?? [],
  }));

  return { medications };
};

export const getLabsData = async ({
  userId,
  resourceType,
}: {
  userId: string;
  resourceType: ResourceType;
}) => {
  const rawObservations = await Promise.all(
    labsObservationCollections.map(async (type) => ({
      type,
      data: await getDocsData(
        refs.userObservation({ userId, resourceType, observationType: type }),
      ),
    })),
  );

  const observations = rawObservations.flatMap((observations) =>
    observations.data.map((observation) => ({
      id: observation.id,
      effectiveDateTime: observation.effectiveDateTime,
      value: observation.valueQuantity?.value,
      unit: observation.valueQuantity?.unit,
      type: observations.type,
    })),
  );

  return { observations, userId, resourceType };
};

export const getAllergyType = (allergy: FHIRAllergyIntolerance) => {
  if (
    allergy.type === FHIRAllergyIntoleranceType.allergy &&
    allergy.criticality === FHIRAllergyIntoleranceCriticality.high
  )
    return AllergyType.severeAllergy;
  if (allergy.type === FHIRAllergyIntoleranceType.allergy)
    return AllergyType.allergy;
  if (allergy.type === FHIRAllergyIntoleranceType.intolerance)
    return AllergyType.intolerance;
  if (allergy.type === FHIRAllergyIntoleranceType.financial)
    return AllergyType.financial;
  return AllergyType.preference;
};

export const getAllergiesData = async ({
  userId,
  resourceType,
}: {
  userId: string;
  resourceType: ResourceType;
}) => {
  const rawAllergies = await getDocsData(
    refs.allergyIntolerances({ userId, resourceType }),
  );
  const allergyIntolerances = rawAllergies.map((allergy) => ({
    id: allergy.id,
    type: getAllergyType(allergy),
    medication: allergy.code?.coding?.at(0)?.code,
  }));
  return { allergyIntolerances, userId, resourceType };
};

export const getAppointmentsData = async ({
  userId,
  resourceType,
}: {
  userId: string;
  resourceType: ResourceType;
}) => {
  const rawAppointments = await queryClient.ensureQueryData(
    appointmentsQueries.list({ userId, resourceType }),
  );
  return {
    appointments: rawAppointments.map(parseAppointment),
    userId,
    resourceType,
  };
};

export const getPatientInfo = async ({
  user,
  resourceType,
  authUser,
}: UserData) => {
  const latestQuestionnaires = await getDocsData(
    query(
      refs.questionnaireResponses({ resourceType, userId: authUser.uid }),
      orderBy("authored", "desc"),
      limit(1),
    ),
  );
  return {
    email: authUser.email,
    lastActiveDate: user.lastActiveDate,
    latestQuestionnaireDate: latestQuestionnaires.at(0)?.authored,
    invitationCode: user.invitationCode,
    isInvitation: resourceType === "invitation",
  };
};

export type AllergiesData = Awaited<ReturnType<typeof getAllergiesData>>;
export type Allergy = AllergiesData["allergyIntolerances"][number];
export type AppointmentsData = Awaited<ReturnType<typeof getAppointmentsData>>;
export type Appointment = AppointmentsData["appointments"][number];
export type LabsData = Awaited<ReturnType<typeof getLabsData>>;
export type Observation = LabsData["observations"][number];
export type MedicationsData = Awaited<ReturnType<typeof getMedicationsData>>;
export type PatientInfo = Awaited<ReturnType<typeof getPatientInfo>>;
