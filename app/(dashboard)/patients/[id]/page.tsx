//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { deleteField } from '@firebase/firestore'
import { Contact } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import {
  PatientForm,
  type PatientFormSchema,
} from '@/app/(dashboard)/patients/PatientForm'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { mapAuthData } from '@/modules/firebase/user'
import {
  getDocData,
  getDocsData,
  updateDocData,
} from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { DashboardLayout } from '../../DashboardLayout'

interface PatientPageProps {
  params: { id: string }
}

const PatientPage = async ({ params }: PatientPageProps) => {
  // TODO: Validate against non-patient
  const { refs, docRefs } = await getAuthenticatedOnlyApp()
  const userId = params.id
  const allAuthData = await mapAuthData({ userIds: [userId] }, (data, id) => ({
    uid: id,
    ...data,
  }))
  const authUser = allAuthData.at(0)?.auth
  if (!authUser) {
    notFound()
  }
  const organizations = await getDocsData(refs.organizations())
  const user = await getDocData(docRefs.user(userId))
  const patient = await getDocData(docRefs.patient(userId))

  if (!user)
    throw new Error(
      `Malfunction of the data, user doc doesn't exist for ${userId}`,
    )
  if (!patient)
    throw new Error(
      `Malfunction of the data, patient doc doesn't exist for ${userId}`,
    )

  const updatePatient = async (form: PatientFormSchema) => {
    'use server'
    const { docRefs, callables } = await getAuthenticatedOnlyApp()
    await callables.updateUserInformation({
      userId,
      data: {
        auth: {
          displayName: form.displayName,
          email: form.email,
          phoneNumber: null,
          photoURL: null,
        },
      },
    })
    const userRef = docRefs.user(userId)
    await updateDocData(userRef, {
      invitationCode: form.invitationCode,
      organization: form.organizationId ?? deleteField(),
    })
    // TODO: Update patient
    revalidatePath(routes.users.index)
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
      <PatientForm
        organizations={organizations}
        user={user}
        userInfo={authUser}
        onSubmit={updatePatient}
      />
    </DashboardLayout>
  )
}

export default PatientPage
