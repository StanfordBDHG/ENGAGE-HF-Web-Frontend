//
// This source file is part of the ENGAGE-HF Web Frontend open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { runTransaction, updateDoc } from "@firebase/firestore";
import { UserType } from "@schmiedmayerlab/engagehf-models";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@schmiedmayerlab/grove-design-system/components/Tabs";
import { toast } from "@schmiedmayerlab/grove-design-system/components/Toaster";
import { getUserName } from "@schmiedmayerlab/grove-design-system/modules/auth";
import { PageTitle } from "@schmiedmayerlab/grove-design-system/molecules/DashboardLayout";
import { syncData } from "@schmiedmayerlab/grove-design-system/utils/data";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { Contact } from "lucide-react";
import { z } from "zod";
import { NotFound } from "@/components/NotFound";
import { callables, db, docRefs, refs } from "@/modules/firebase/app";
import {
  getMedicationRequestData,
  getMedicationRequestMedicationIds,
} from "@/modules/firebase/medication";
import { useIsUserRole } from "@/modules/firebase/UserProvider";
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
  type AllergiesData,
  type AppointmentsData,
  formatBirthDate,
  getAllergiesData,
  getAppointmentsData,
  getFormProps,
  getLabsData,
  getMeasurementsData,
  getMedicationsData,
  getPatientInfo,
  type LabsData,
  type MeasurementsData,
  type MedicationsData,
} from "@/routes/~_dashboard/~patients/utils";
import { Allergies } from "@/routes/~_dashboard/~patients/~$id/Allergies";
import { Appointments } from "@/routes/~_dashboard/~patients/~$id/Appointments";
import { ExportUserData } from "@/routes/~_dashboard/~patients/~$id/ExportUserData";
import { GenerateHealthSummary } from "@/routes/~_dashboard/~patients/~$id/GenerateHealthSummary";
import { Labs } from "@/routes/~_dashboard/~patients/~$id/Labs";
import { Measurements } from "@/routes/~_dashboard/~patients/~$id/Measurements";
import { Notifications } from "@/routes/~_dashboard/~patients/~$id/Notifications";
import { PatientInfo } from "@/routes/~_dashboard/~patients/~$id/PatientInfo";
import { getTitle } from "@/utils/head";
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
  measurements = "measurements",
}

const PatientPage = () => {
  const router = useRouter();
  const { isUserRole } = useIsUserRole();
  const { tab } = Route.useSearch();
  const {
    userId,
    medications,
    formProps,
    userMedications,
    allergiesData,
    labsData,
    appointmentsData,
    measurementsData,
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
      dateOfBirth: formatBirthDate(form.dateOfBirth),
      providerName: form.providerName,
    };
    if (resourceType === "user") {
      await callables.updateUserInformation({
        userId,
        data: {
          auth: {
            ...authData,
            email: form.email,
          },
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
  const isPermanentInvitation = info.isInvitation && info.permanent;

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
        <div className="flex gap-2">
          {isUserRole([UserType.admin, UserType.owner]) && (
            <ExportUserData
              userId={userId}
              resourceType={resourceType}
              userName={userName}
            />
          )}
          <GenerateHealthSummary
            userId={userId}
            resourceType={resourceType}
            userName={userName}
          />
        </div>
      }
    >
      <title>{getTitle(`Edit ${userName}`)}</title>
      <Tabs defaultValue={tab ?? PatientPageTab.information}>
        <TabsList className="mb-6" grow>
          <TabsTrigger value={PatientPageTab.information}>
            Information
          </TabsTrigger>
          {!isPermanentInvitation && (
            <>
              <TabsTrigger value={PatientPageTab.notifications}>
                Notifications
              </TabsTrigger>
              <TabsTrigger value={PatientPageTab.medications}>
                Medications
              </TabsTrigger>
              <TabsTrigger value={PatientPageTab.allergies}>
                Allergies
              </TabsTrigger>
              <TabsTrigger value={PatientPageTab.labs}>Labs</TabsTrigger>
              <TabsTrigger value={PatientPageTab.appointments}>
                Appointments
              </TabsTrigger>
              <TabsTrigger value={PatientPageTab.measurements}>
                Measurements
              </TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent value={PatientPageTab.information}>
          <div className="flex flex-col gap-6 xl:flex-row">
            <PatientInfo info={info} />
            <PatientForm
              user={user}
              userInfo={authUser}
              onSubmit={updatePatient}
              resourceType={resourceType}
              isPermanentInvitation={isPermanentInvitation}
              {...formProps}
            />
          </div>
        </TabsContent>
        {!isPermanentInvitation && (
          <>
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
            <TabsContent value={PatientPageTab.measurements}>
              <Measurements {...measurementsData} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </DashboardLayout>
  );
};

export const Route = createFileRoute("/_dashboard/patients/$id/")({
  component: PatientPage,
  validateSearch: z.object({
    tab: z.enum(PatientPageTab).optional().catch(undefined),
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
    const isPermanentInvitation =
      resourceType === "invitation" && user.permanent;

    const medications: MedicationsData =
      isPermanentInvitation ? { medications: [] } : await getMedicationsData();
    const formProps = await getFormProps();
    const userMedications: Awaited<ReturnType<typeof getUserMedications>> =
      isPermanentInvitation ?
        []
      : await getUserMedications({ userId, resourceType });
    const allergiesData: AllergiesData =
      isPermanentInvitation ?
        { allergyIntolerances: [], userId, resourceType }
      : await getAllergiesData({ userId, resourceType });
    const labsData: LabsData =
      isPermanentInvitation ?
        { observations: [], userId, resourceType }
      : await getLabsData({ userId, resourceType });
    const appointmentsData: AppointmentsData =
      isPermanentInvitation ?
        { appointments: [], userId, resourceType }
      : await getAppointmentsData({ userId, resourceType });
    const measurementsData: MeasurementsData =
      isPermanentInvitation ?
        { observations: [], userId, resourceType }
      : await getMeasurementsData({ userId, resourceType });

    return {
      user,
      userId,
      authUser,
      resourceType,
      medications,
      formProps,
      userMedications,
      allergiesData,
      labsData,
      appointmentsData,
      measurementsData,
      info: await getPatientInfo(userData),
    };
  },
});
