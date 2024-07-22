//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { setDoc } from '@firebase/firestore'
import { Users } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import { type EditUserFormSchema } from '@/app/(dashboard)/users/[id]/utils'
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
import { EditUserForm } from './EditUserForm'
import { DashboardLayout } from '../../DashboardLayout'

const getData = async (userId: string) => {
  const { refs, docRefs } = await getAuthenticatedOnlyApp()
  const organizations = await getDocsData(refs.organizations())
  const user = await getDocData(docRefs.user(userId))
  const allAuthData = await mapAuthData([userId], (data, id) => ({
    id,
    ...data,
  }))
  const authUser = allAuthData.at(0)

  if (!authUser) {
    notFound()
  }

  return {
    user:
      user ?
        { ...user, dateOfEnrollment: user.dateOfEnrollment.toJSON() }
      : undefined,
    organizations,
    authUser,
    role: await getUserRole(userId),
  }
}

export type Data = Awaited<ReturnType<typeof getData>>

const UserPage = async ({ params }: { params: { id: string } }) => {
  await allowRoles([Role.admin, Role.owner])
  const userId = params.id
  const data = await getData(userId)

  const saveUser = async (form: EditUserFormSchema) => {
    'use server'
    const { docRefs, callables } = await getAuthenticatedOnlyApp()
    console.log(userId, form, data)
    await callables.updateUserInformation({
      userId,
      data: { auth: { displayName: form.displayName, email: form.email } },
    })
    const user = docRefs.user(userId)
    await updateDocData(user, {
      invitationCode: form.invitationCode,
      organization: form.organizationId,
    })
    const userRole = data.role.role
    if (userRole === Role.admin && form.role !== Role.admin) {
      await callables.revokeAdmin({ userId })
    } else if (
      userRole === Role.owner &&
      (form.role !== Role.owner ||
        data.user?.organization !== form.organizationId)
    ) {
      await callables.revokeOwner({
        userId,
        organizationId: data.user?.organization,
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
          subTitle={getUserName(data.authUser)}
          icon={<Users />}
        />
      }
    >
      <div className="mx-auto w-full max-w-[800px]">
        <EditUserForm data={data} onSubmit={saveUser} />
      </div>
    </DashboardLayout>
  )
}

export default UserPage
