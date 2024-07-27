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
import { getFormProps } from '@/app/(dashboard)/patients/utils'
import { getAuthenticatedOnlyApp, getUserRole } from '@/modules/firebase/guards'
import { mapAuthData } from '@/modules/firebase/user'
import { getDocDataOrThrow, updateDocData } from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { DashboardLayout } from '../../DashboardLayout'
import { Role } from '@/modules/firebase/role'

interface PatientPageProps {
  params: { id: string }
}

const PatientPage = async ({ params }: PatientPageProps) => {
  const { docRefs } = await getAuthenticatedOnlyApp()
  const userId = params.id
  const allAuthData = await mapAuthData({ userIds: [userId] }, (data, id) => ({
    uid: id,
    ...data,
  }))
  const authUser = allAuthData.at(0)?.auth
  const userRole = await getUserRole(userId)
  if (!authUser || userRole.role !== Role.user) {
    notFound()
  }
  const user = await getDocDataOrThrow(docRefs.user(userId))
  const patient = await getDocDataOrThrow(docRefs.patient(userId))

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
        user={user}
        userInfo={authUser}
        onSubmit={updatePatient}
        {...await getFormProps()}
      />
    </DashboardLayout>
  )
}

export default PatientPage
