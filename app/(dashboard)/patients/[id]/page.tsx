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
  getMedicationsData,
} from '@/app/(dashboard)/patients/utils'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { mapAuthData } from '@/modules/firebase/user'
import {
  getDocDataOrThrow,
  getDocsData,
  UserType,
} from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { Medications, MedicationsFormSchema } from '../Medications'
import { DashboardLayout } from '../../DashboardLayout'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/packages/design-system/src/components/Tabs'
import { getMedicationRequestData } from '@/modules/firebase/models/medication'

const getUserMedications = async (userId: string) => {
  const { refs } = await getAuthenticatedOnlyApp()
  const medicationRequests = await getDocsData(refs.medicationRequests(userId))
  return medicationRequests.map((request) => {
    // TODO: Implement stronger mechanism
    const reference = request.medicationReference?.reference?.split('/')
    return {
      id: request.id,
      medication: reference?.at(1) ?? '',
      drug: reference?.at(3) ?? '',
      frequencyPerDay:
        request?.dosageInstruction?.at(0)?.timing?.repeat?.frequency ?? 1,
      quantity:
        request?.dosageInstruction?.at(0)?.doseAndRate?.at(0)?.doseQuantity
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
}

const PatientPage = async ({ params }: PatientPageProps) => {
  const { docRefs } = await getAuthenticatedOnlyApp()
  const userId = params.id
  const allAuthData = await mapAuthData({ userIds: [userId] }, (data, id) => ({
    uid: id,
    email: data.auth.email,
    displayName: data.auth.displayName,
  }))
  const authUser = allAuthData.at(0)
  const user = await getDocDataOrThrow(docRefs.user(userId))
  if (!authUser || user.type !== UserType.patient) {
    notFound()
  }

  const updatePatient = async (form: PatientFormSchema) => {
    'use server'
    const { docRefs, callables } = await getAuthenticatedOnlyApp()
    await callables.updateUserInformation({
      userId,
      data: {
        auth: {
          displayName: form.displayName,
          email: form.email,
        },
      },
    })
    const userRef = docRefs.user(userId)
    const clinician = await getDocDataOrThrow(docRefs.user(form.clinician))
    await updateDoc(userRef, {
      invitationCode: form.invitationCode,
      clinician: form.clinician,
      organization: clinician.organization,
    })
    revalidatePath(routes.users.index)
  }

  const saveMedications = async (form: MedicationsFormSchema) => {
    'use server'
    const { docRefs, db, refs } = await getAuthenticatedOnlyApp()
    const medicationRequests = await getDocsData(
      refs.medicationRequests(userId),
    )
    await runTransaction(db, async (transaction) => {
      medicationRequests.forEach((medication) => {
        transaction.delete(docRefs.medicationRequest(userId, medication.id))
      })
      form.medications.forEach((medication) => {
        transaction.set(
          docRefs.medicationRequest(userId, medication.id),
          getMedicationRequestData(medication),
        )
      })
    })
  }

  return (
    <DashboardLayout
      title={
        <PageTitle
          title="Edit patient"
          subTitle={getUserName(authUser)}
          icon={<Contact />}
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
              medications: await getUserMedications(userId),
            }}
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

export default PatientPage
