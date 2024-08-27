//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { runTransaction, updateDoc } from '@firebase/firestore'
import { createFileRoute, notFound, useRouter } from '@tanstack/react-router'
import { Contact } from 'lucide-react'
import { callables, db, docRefs, refs } from '@/modules/firebase/guards'
import {
  getMedicationRequestData,
  getMedicationRequestMedicationIds,
} from '@/modules/firebase/models/medication'
import {
  getDocDataOrThrow,
  getDocsData,
  type ResourceType,
  UserType,
} from '@/modules/firebase/utils'
import { getUserData } from '@/modules/user/queries'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/packages/design-system/src/components/Tabs'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import {
  Medications,
  type MedicationsFormSchema,
} from '@/routes/~_dashboard/~patients/Medications'
import {
  PatientForm,
  type PatientFormSchema,
} from '@/routes/~_dashboard/~patients/PatientForm'
import {
  getAllergiesData,
  getAppointmentsData,
  getFormProps,
  getLabsData,
  getMedicationsData,
} from '@/routes/~_dashboard/~patients/utils'
import { Allergies } from '@/routes/~_dashboard/~patients/~$id/Allergies'
import { Appointments } from '@/routes/~_dashboard/~patients/~$id/Appointments'
import { GenerateHealthSummary } from '@/routes/~_dashboard/~patients/~$id/GenerateHealthSummary'
import { Labs } from '@/routes/~_dashboard/~patients/~$id/Labs'
import { DashboardLayout } from '../../DashboardLayout'

const getUserMedications = async (payload: {
  userId: string
  resourceType: ResourceType
}) => {
  const medicationRequests = await getDocsData(refs.medicationRequests(payload))
  return medicationRequests.map((request) => {
    const ids = getMedicationRequestMedicationIds(request)
    const dosage = request.dosageInstruction?.at(0)
    return {
      id: request.id,
      medication: ids.medicationId ?? '',
      drug: ids.drugId ?? '',
      frequencyPerDay: dosage?.timing?.repeat?.frequency ?? 1,
      quantity: dosage?.doseAndRate?.at(0)?.doseQuantity?.value ?? 1,
      instructions: dosage?.text ?? '',
    }
  })
}

enum Tab {
  information = 'information',
  medications = 'medications',
  allergies = 'allergies',
  labs = 'labs',
  appointments = 'appointments',
}

const PatientPage = () => {
  const router = useRouter()
  const { id: userId } = Route.useParams()
  const {
    medications,
    formProps,
    userMedications,
    allergiesData,
    labsData,
    appointmentsData,
    user,
    authUser,
    resourceType,
  } = Route.useLoaderData()

  const updatePatient = async (form: PatientFormSchema) => {
    const clinician = await getDocDataOrThrow(docRefs.user(form.clinician))
    const authData = {
      displayName: form.displayName,
      email: form.email,
    }
    const userData = {
      invitationCode: form.invitationCode,
      clinician: form.clinician,
      organization: clinician.organization,
      dateOfBirth: form.dateOfBirth?.toISOString(),
    }
    if (resourceType === 'user') {
      await callables.updateUserInformation({
        userId,
        data: {
          auth: authData,
        },
      })
      await updateDoc(docRefs.user(userId), userData)
    } else {
      const invitation = await getDocDataOrThrow(docRefs.invitation(userId))
      await updateDoc(docRefs.invitation(userId), {
        auth: {
          ...invitation.auth,
          ...authData,
        },
        user: {
          ...invitation.user,
          ...userData,
        },
      })
    }
    void router.invalidate()
  }

  const saveMedications = async (form: MedicationsFormSchema) => {
    const medicationRequests = await getDocsData(
      refs.medicationRequests({ userId, resourceType }),
    )
    // async is required to match types
    // eslint-disable-next-line @typescript-eslint/require-await
    await runTransaction(db, async (transaction) => {
      medicationRequests.forEach((medication) => {
        transaction.delete(
          docRefs.medicationRequest({
            userId,
            medicationRequestId: medication.id,
            resourceType,
          }),
        )
      })
      form.medications.forEach((medication) => {
        transaction.set(
          docRefs.medicationRequest({
            userId,
            medicationRequestId: medication.id,
            resourceType,
          }),
          getMedicationRequestData(medication),
        )
      })
    })
  }

  const userName = getUserName(authUser) ?? ''

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
      <Tabs defaultValue={Tab.medications}>
        <TabsList className="mb-6 w-full">
          <TabsTrigger value={Tab.information} className="grow">
            Information
          </TabsTrigger>
          <TabsTrigger value={Tab.medications} className="grow">
            Medications
          </TabsTrigger>
          <TabsTrigger value={Tab.allergies} className="grow">
            Allergies
          </TabsTrigger>
          <TabsTrigger value={Tab.labs} className="grow">
            Labs
          </TabsTrigger>
          <TabsTrigger value={Tab.appointments} className="grow">
            Appointments
          </TabsTrigger>
        </TabsList>
        <TabsContent value={Tab.information}>
          <PatientForm
            user={user}
            userInfo={authUser}
            onSubmit={updatePatient}
            {...formProps}
          />
        </TabsContent>
        <TabsContent value={Tab.medications}>
          <Medications
            {...medications}
            onSave={saveMedications}
            defaultValues={{
              medications: userMedications,
            }}
          />
        </TabsContent>
        <TabsContent value={Tab.allergies}>
          <Allergies {...medications} {...allergiesData} />
        </TabsContent>
        <TabsContent value={Tab.labs}>
          <Labs {...labsData} />
        </TabsContent>
        <TabsContent value={Tab.appointments}>
          <Appointments {...appointmentsData} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

export const Route = createFileRoute('/_dashboard/patients/$id/')({
  component: PatientPage,
  loader: async ({ params }) => {
    const userId = params.id
    const { resourceType, user, authUser } = await getUserData(userId)
    if (!user || !authUser || user.type !== UserType.patient) {
      throw notFound()
    }

    return {
      user,
      authUser,
      resourceType,
      medications: await getMedicationsData(),
      formProps: await getFormProps(),
      userMedications: await getUserMedications({ userId, resourceType }),
      allergiesData: await getAllergiesData({ userId, resourceType }),
      labsData: await getLabsData({ userId, resourceType }),
      appointmentsData: await getAppointmentsData({ userId, resourceType }),
    }
  },
})
