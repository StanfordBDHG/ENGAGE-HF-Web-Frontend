//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { deleteField, updateDoc } from '@firebase/firestore'
import { Users } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import { allowTypes, getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { mapAuthData } from '@/modules/firebase/user'
import { getDocData, getDocsData, UserType } from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { DashboardLayout } from '../../DashboardLayout'
import { UserForm, type UserFormSchema } from '../UserForm'

interface UserPageProps {
  params: { id: string }
}

const UserPage = async ({ params }: UserPageProps) => {
  await allowTypes([UserType.admin, UserType.owner])
  const { refs, docRefs } = await getAuthenticatedOnlyApp()
  const userId = params.id
  const allAuthData = await mapAuthData({ userIds: [userId] }, (data, id) => ({
    uid: id,
    email: data.auth.email,
    displayName: data.auth.displayName,
  }))
  const authUser = allAuthData.at(0)
  const user = await getDocData(docRefs.user(userId))
  if (!authUser || !user || user.type === UserType.patient) {
    notFound()
  }
  const organizations = await getDocsData(refs.organizations())

  const updateUser = async (form: UserFormSchema) => {
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
    await updateDoc(userRef, {
      invitationCode: form.invitationCode,
      organization: form.organizationId ?? deleteField(),
      type: form.type,
    })
    revalidatePath(routes.users.index)
  }

  return (
    <DashboardLayout
      title={
        <PageTitle
          title="Edit user"
          subTitle={getUserName(authUser)}
          icon={<Users />}
        />
      }
    >
      <UserForm
        organizations={organizations}
        type={user.type}
        user={user}
        userInfo={authUser}
        onSubmit={updateUser}
      />
    </DashboardLayout>
  )
}

export default UserPage
