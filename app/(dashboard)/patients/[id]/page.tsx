//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { runTransaction, updateDoc } from '@firebase/firestore'
import { Contact } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import {
  PatientForm,
  type PatientFormSchema,
} from '@/app/(dashboard)/patients/PatientForm'
import {
  getFormProps,
  getLabsData,
  getMedicationsData,
} from '@/app/(dashboard)/patients/utils'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
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
import { routes } from '@/modules/routes'
import { getUserData } from '@/modules/user/queries'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/packages/design-system/src/components/Tabs'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { GenerateHealthSummary } from './GenerateHealthSummary'
import { Labs } from './Labs'
import { DashboardLayout } from '../../DashboardLayout'
import { Medications, type MedicationsFormSchema } from '../Medications'

const getUserMedications = async (payload: {
  userId: string
  resourceType: ResourceType
}) => {
  const { refs } = await getAuthenticatedOnlyApp()
  const medicationRequests = await getDocsData(refs.medicationRequests(payload))
  return medicationRequests.map((request) => {
    const ids = getMedicationRequestMedicationIds(request)
    return {
      id: request.id,
      medication: ids.medicationId ?? '',
      drug: ids.drugId ?? '',
      frequencyPerDay:
        request.dosageInstruction?.at(0)?.timing?.repeat?.frequency ?? 1,
      quantity:
        request.dosageInstruction?.at(0)?.doseAndRate?.at(0)?.doseQuantity
          ?.value ?? 1,
    }
  })
}

interface PatientPageProps {
  params: { id: string }
}

enum Tab {
  information = 'information',
  medications = 'medications',
  labs = 'labs',
}

const PatientPage = async ({ params }: PatientPageProps) => {
  const userId = params.id
  const { user, authUser, resourceType } = await getUserData(userId)
  if (!user || !authUser || user.type !== UserType.patient) {
    notFound()
  }

  const updatePatient = async (form: PatientFormSchema) => {
    'use server'
    const { docRefs, callables } = await getAuthenticatedOnlyApp()
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

    revalidatePath(routes.patients.index)
  }

  const saveMedications = async (form: MedicationsFormSchema) => {
    'use server'
    const { docRefs, db, refs } = await getAuthenticatedOnlyApp()
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
      <Tabs defaultValue={Tab.information}>
        <TabsList className="mb-6 w-full">
          <TabsTrigger value={Tab.information} className="grow">
            Information
          </TabsTrigger>
          <TabsTrigger value={Tab.medications} className="grow">
            Medications
          </TabsTrigger>
          <TabsTrigger value={Tab.labs} className="grow">
            Labs
          </TabsTrigger>
        </TabsList>
        <TabsContent value={Tab.information}>
          <PatientForm
            user={user}
            userInfo={authUser}
            onSubmit={updatePatient}
            {...await getFormProps()}
          />
        </TabsContent>
        <TabsContent value={Tab.medications}>
          <Medications
            {...await getMedicationsData()}
            onSave={saveMedications}
            defaultValues={{
              medications: await getUserMedications({ userId, resourceType }),
            }}
          />
        </TabsContent>
        <TabsContent value={Tab.labs}>
          <Labs {...await getLabsData({ userId, resourceType })} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

export default PatientPage
