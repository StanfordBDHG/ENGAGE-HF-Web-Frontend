//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { runTransaction, updateDoc } from "@firebase/firestore";
import { UserType } from "@stanfordbdhg/engagehf-models";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@stanfordspezi/spezi-web-design-system/components/Tabs";
import { toast } from "@stanfordspezi/spezi-web-design-system/components/Toaster";
import { getUserName } from "@stanfordspezi/spezi-web-design-system/modules/auth";
import { PageTitle } from "@stanfordspezi/spezi-web-design-system/molecules/DashboardLayout";
import { syncData } from "@stanfordspezi/spezi-web-design-system/utils/data";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { Contact } from "lucide-react";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { NotFound } from "@/components/NotFound";
import { callables, db, docRefs, refs } from "@/modules/firebase/app";
import {
  getMedicationRequestData,
  getMedicationRequestMedicationIds,
} from "@/modules/firebase/medication";
import {
  getDocDataOrThrow,
  getDocsData,
  type ResourceType,
} from "@/modules/firebase/utils";
import { routes } from "@/modules/routes";
import { getUserData, parseUserId } from "@/modules/user/queries";
import {
  Medications,
  type MedicationsFormSchema,
} from "@/routes/~_dashboard/~patients/Medications";
import {
  PatientForm,
  type PatientFormSchema,
} from "@/routes/~_dashboard/~patients/PatientForm";
import {
  getAllergiesData,
  getAppointmentsData,
  getFormProps,
  getLabsData,
  getMedicationsData,
  getPatientInfo,
} from "@/routes/~_dashboard/~patients/utils";
import { Allergies } from "@/routes/~_dashboard/~patients/~$id/Allergies";
import { Appointments } from "@/routes/~_dashboard/~patients/~$id/Appointments";
import { GenerateHealthSummary } from "@/routes/~_dashboard/~patients/~$id/GenerateHealthSummary";
import { Labs } from "@/routes/~_dashboard/~patients/~$id/Labs";
import { Notifications } from "@/routes/~_dashboard/~patients/~$id/Notifications";
import { PatientInfo } from "@/routes/~_dashboard/~patients/~$id/PatientInfo";
import { DashboardLayout } from "../../DashboardLayout";

const getUserMedications = async (payload: {
  userId: string;
  resourceType: ResourceType;
}) => {
  const medicationRequests = await getDocsData(
    refs.medicationRequests(payload),
  );
  return medicationRequests.map((request) => {
    const ids = getMedicationRequestMedicationIds(request);
    const dosage = request.dosageInstruction?.at(0);
    return {
      id: request.id,
      medication: ids.medicationId ?? "",
      drug: ids.drugId ?? "",
      frequencyPerDay: dosage?.timing?.repeat?.frequency ?? 1,
      quantity: dosage?.doseAndRate?.at(0)?.doseQuantity?.value ?? 1,
      instructions: dosage?.text ?? "",
    };
  });
};

export enum PatientPageTab {
  information = "information",
  notifications = "notifications",
  medications = "medications",
  allergies = "allergies",
  labs = "labs",
  appointments = "appointments",
}

const PatientPage = () => {
  const router = useRouter();
  const { tab } = Route.useSearch();
  const {
    userId,
    medications,
    formProps,
    userMedications,
    allergiesData,
    labsData,
    appointmentsData,
    user,
    authUser,
    resourceType,
    info,
  } = Route.useLoaderData();

  const updatePatient = async (form: PatientFormSchema) => {
    const clinician = await getDocDataOrThrow(docRefs.user(form.clinician));
    const authData = {
      displayName: form.displayName,
    };
    const userData = {
      clinician: form.clinician,
      organization: clinician.organization,
      dateOfBirth: form.dateOfBirth?.toISOString() ?? null,
      providerName: form.providerName,
    };
    if (resourceType === "user") {
      await callables.updateUserInformation({
        userId,
        data: {
          auth: authData,
        },
      });
      await updateDoc(docRefs.user(userId), userData);
    } else {
      const invitation = await getDocDataOrThrow(docRefs.invitation(userId));
      await updateDoc(docRefs.invitation(userId), {
        auth: {
          ...invitation.auth,
          ...authData,
        },
        user: {
          ...invitation.user,
          ...userData,
        },
      });
    }
    toast.success("Patient has been successfully updated!");
    void router.invalidate();
  };

  const saveMedications = async (form: MedicationsFormSchema) => {
    const freshUserMedications = await getUserMedications({
      userId,
      resourceType,
    });
    const getMedicationRequestRef = (id: string) =>
      docRefs.medicationRequest({
        userId,
        medicationRequestId: id,
        resourceType,
      });

    // async is required to match types
    // eslint-disable-next-line @typescript-eslint/require-await
    await runTransaction(db, async (transaction) => {
      syncData({
        newItems: form.medications,
        oldItems: freshUserMedications,
        getId: (medication) => medication.id,
        onDelete: (id) => {
          transaction.delete(getMedicationRequestRef(id));
        },
        onCreate: (id, medication) => {
          transaction.set(
            getMedicationRequestRef(id),
            getMedicationRequestData(medication),
          );
        },
        onUpdate: (id, medication) => {
          transaction.set(
            getMedicationRequestRef(id),
            getMedicationRequestData(medication),
          );
        },
      });
    });
  };

  const userName = getUserName(authUser) ?? "";

  return (
    <DashboardLayout
      title={
        <PageTitle
          title="Edit patient"
          subTitle={userName}
          icon={<Contact />}
        />
      }
      actions={
        <GenerateHealthSummary
          userId={userId}
          resourceType={resourceType}
          userName={userName}
        />
      }
    >
      <Helmet>
        <title>Edit {userName}</title>
      </Helmet>
      <Tabs defaultValue={tab ?? PatientPageTab.information}>
        <TabsList className="mb-6" grow>
          <TabsTrigger value={PatientPageTab.information}>
            Information
          </TabsTrigger>
          <TabsTrigger value={PatientPageTab.notifications}>
            Notifications
          </TabsTrigger>
          <TabsTrigger value={PatientPageTab.medications}>
            Medications
          </TabsTrigger>
          <TabsTrigger value={PatientPageTab.allergies}>Allergies</TabsTrigger>
          <TabsTrigger value={PatientPageTab.labs}>Labs</TabsTrigger>
          <TabsTrigger value={PatientPageTab.appointments}>
            Appointments
          </TabsTrigger>
        </TabsList>
        <TabsContent value={PatientPageTab.information}>
          <div className="flex flex-col gap-6 xl:flex-row">
            <PatientInfo info={info} />
            <PatientForm
              user={user}
              userInfo={authUser}
              onSubmit={updatePatient}
              {...formProps}
            />
          </div>
        </TabsContent>
        <TabsContent value={PatientPageTab.notifications}>
          <Notifications userId={userId} />
        </TabsContent>
        <TabsContent value={PatientPageTab.medications}>
          <Medications
            {...medications}
            onSave={saveMedications}
            defaultValues={{
              medications: userMedications,
            }}
          />
        </TabsContent>
        <TabsContent value={PatientPageTab.allergies}>
          <Allergies {...medications} {...allergiesData} />
        </TabsContent>
        <TabsContent value={PatientPageTab.labs}>
          <Labs {...labsData} />
        </TabsContent>
        <TabsContent value={PatientPageTab.appointments}>
          <Appointments {...appointmentsData} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export const Route = createFileRoute("/_dashboard/patients/$id/")({
  component: PatientPage,
  validateSearch: z.object({
    tab: z.nativeEnum(PatientPageTab).optional().catch(undefined),
  }),
  notFoundComponent: () => (
    <NotFound
      entityName="patient"
      backPage={{ name: "patients list", href: routes.patients.index }}
    />
  ),
  loader: async ({ params }) => {
    const { userId, resourceType } = parseUserId(params.id);
    const userData = await getUserData(userId, resourceType, [
      UserType.patient,
    ]);
    if (!userData) throw notFound();
    const { user, authUser } = userData;

    return {
      user,
      userId,
      authUser,
      resourceType,
      medications: await getMedicationsData(),
      formProps: await getFormProps(),
      userMedications: await getUserMedications({ userId, resourceType }),
      allergiesData: await getAllergiesData({ userId, resourceType }),
      labsData: await getLabsData({ userId, resourceType }),
      appointmentsData: await getAppointmentsData({ userId, resourceType }),
      info: await getPatientInfo(userData),
    };
  },
});
