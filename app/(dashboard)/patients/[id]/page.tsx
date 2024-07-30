//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { updateDoc } from '@firebase/firestore'
import { Contact } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import {
  PatientForm,
  type PatientFormSchema,
} from '@/app/(dashboard)/patients/PatientForm'
import { getFormProps } from '@/app/(dashboard)/patients/utils'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { mapAuthData } from '@/modules/firebase/user'
import { getDocDataOrThrow, UserType } from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { DashboardLayout } from '../../DashboardLayout'

interface PatientPageProps {
  params: { id: string }
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
