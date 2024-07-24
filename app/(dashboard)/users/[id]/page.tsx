//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { deleteField, setDoc } from '@firebase/firestore'
import { Users } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import {
  allowRoles,
  getAuthenticatedOnlyApp,
  getUserRole,
} from '@/modules/firebase/guards'
import { Role } from '@/modules/firebase/role'
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
import { UserForm, type UserFormSchema } from '../UserForm'

interface UserPageProps {
  params: { id: string }
}

const UserPage = async ({ params }: UserPageProps) => {
  await allowRoles([Role.admin, Role.owner])
  const { refs, docRefs } = await getAuthenticatedOnlyApp()
  const userId = params.id
  const allAuthData = await mapAuthData({ userIds: [userId] }, (data, id) => ({
    uid: id,
    ...data,
  }))
  const authUser = allAuthData.at(0)?.auth
  const { role } = await getUserRole(userId)
  if (!authUser || role === Role.user) {
    notFound()
  }
  const organizations = await getDocsData(refs.organizations())
  const user = await getDocData(docRefs.user(userId))

  if (!user) {
    throw new Error(
      `Malfunction of the data, user doc doesn't exist for ${userId}`,
    )
  }

  const updateUser = async (form: UserFormSchema) => {
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

    if (role === Role.admin && form.role !== Role.admin) {
      await callables.revokeAdmin({ userId })
    } else if (
      role === Role.owner &&
      (form.role !== Role.owner || user.organization !== form.organizationId)
    ) {
      await callables.revokeOwner({
        userId,
        organizationId: user.organization,
      })
    }
    if (form.role === Role.admin) {
      await callables.grantAdmin({ userId })
    } else if (form.role === Role.owner) {
      await callables.grantOwner({
        userId,
        organizationId: form.organizationId,
      })
    } else {
      const ref = docRefs.clinician(userId)
      const clinician = await getDocData(ref)
      if (!clinician) await setDoc(ref, {})
    }
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
        role={role}
        user={user}
        userInfo={authUser}
        onSubmit={updateUser}
      />
    </DashboardLayout>
  )
}

export default UserPage
