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
import { allowRoles, getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { Role } from '@/modules/firebase/role'
import { getDocsData } from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { DashboardLayout } from '../../DashboardLayout'

const CreateUserPage = async () => {
  await allowRoles([Role.admin, Role.owner])
  const { refs } = await getAuthenticatedOnlyApp()
  const organizations = await getDocsData(refs.organizations())

  const createUser = async (form: UserFormSchema) => {
    'use server'
    const { callables } = await getAuthenticatedOnlyApp()
    await callables.createInvitation({
      auth: {
        displayName: form.displayName,
        email: form.email,
        phoneNumber: null,
        photoURL: null,
      },
      admin: form.role === Role.admin ? {} : undefined,
      clinician: form.role === Role.clinician ? {} : undefined,
      user: { organization: form.organizationId },
    })
    redirect(routes.users.index)
    // TODO: Confirmation message
  }

  return (
    <DashboardLayout title={<PageTitle title="Create user" icon={<Users />} />}>
      <UserForm organizations={organizations} onSubmit={createUser} />
    </DashboardLayout>
  )
}

export default CreateUserPage
