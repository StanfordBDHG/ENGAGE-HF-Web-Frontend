//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { getDocs, query, type QuerySnapshot, where } from 'firebase/firestore'
import { getAuth } from 'firebase-admin/auth'
import { Users } from 'lucide-react'
import {
  allowRoles,
  getAuthenticatedOnlyApp,
  getUserRole,
} from '@/modules/firebase/guards'
import { Role } from '@/modules/firebase/role'
import { getAdminApp, type Organization } from '@/modules/firebase/utils'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { UsersTable } from './UsersTable'
import { DashboardLayout } from '../DashboardLayout'

const getAdminData = async () => {
  const { refs } = await getAuthenticatedOnlyApp()
  const admins = await getDocs(refs.admins())
  const organizations = await getDocs(refs.organizations())

  const adminIds = new Set(admins.docs.map((admin) => admin.id))

  return {
    adminIds,
    organizations,
    cliniciansQuery: refs.clinicians(),
  }
}

const getOwnerData = async (organizations: QuerySnapshot<Organization>) => {
  const { refs } = await getAuthenticatedOnlyApp()
  const organizationIds = organizations.docs.map(
    (organization) => organization.id,
  )
  const cliniciansQuery = query(
    refs.clinicians(),
    where('organization', 'in', organizationIds),
  )

  return {
    adminIds: new Set<string>(),
    organizations,
    cliniciansQuery,
  }
}

const listUsers = async () => {
  const role = await getUserRole()
  const { adminIds, organizations, cliniciansQuery } =
    role.role === Role.admin ?
      await getAdminData()
      // Non-null assertion is fine here
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    : await getOwnerData(role.organizations!)

  const clinicians = await getDocs(cliniciansQuery)
  const clinicianIds = new Set(clinicians.docs.map((clinician) => clinician.id))

  const ownersIds = new Set(
    organizations.docs.flatMap((organization) => organization.data().owners),
  )

  const userIdsToGet = [
    ...adminIds.values(),
    ...clinicianIds.values(),
    ...ownersIds.values(),
  ].map((id) => ({ uid: id }))

  const adminApp = getAdminApp()
  const adminAuth = getAuth(adminApp)

  // TODO: It can take max 100 users. Batch/paginate? Use getting by id? Fetch all and match?
  const users = await adminAuth.getUsers(userIdsToGet)
  const usersData = users.users.map((user) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role:
      adminIds.has(user.uid) ? 'Admin'
      : clinicianIds.has(user.uid) ? 'Clinician'
      : ownersIds.has(user.uid) ? 'Owner'
      : '-',
  }))

  return usersData
}

export type User = Awaited<ReturnType<typeof listUsers>>[number]

const UsersPage = async () => {
  await allowRoles([Role.admin, Role.owner])
  const users = await listUsers()

  return (
    <DashboardLayout title={<PageTitle title="Users" icon={<Users />} />}>
      <UsersTable data={users} />
    </DashboardLayout>
  )
}

export default UsersPage
