//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { Users } from 'lucide-react'
import { redirect } from 'next/navigation'
import { UserForm, type UserFormSchema } from '@/app/(dashboard)/users/UserForm'
import { allowTypes, getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { UserType } from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import { getUserOrganizations } from '@/modules/user/queries'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { DashboardLayout } from '../../DashboardLayout'

const InviteUserPage = async () => {
  await allowTypes([UserType.admin, UserType.owner])
  const organizations = await getUserOrganizations()

  const inviteUser = async (form: UserFormSchema) => {
    'use server'
    const { callables } = await getAuthenticatedOnlyApp()
    const result = await callables.createInvitation({
      auth: {
        displayName: form.displayName,
        email: form.email,
      },
      user: {
        ...(form.organizationId ? { organization: form.organizationId } : {}),
        type: form.type,
      },
    })
    redirect(routes.users.user(result.data.code))
  }

  return (
    <DashboardLayout title={<PageTitle title="Invite user" icon={<Users />} />}>
      <UserForm organizations={organizations} onSubmit={inviteUser} />
    </DashboardLayout>
  )
}

export default InviteUserPage
