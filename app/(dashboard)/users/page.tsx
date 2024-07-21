//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { getDocs, query, type QuerySnapshot, where } from 'firebase/firestore'
import { Users } from 'lucide-react'
import {
  allowRoles,
  getAuthenticatedOnlyApp,
  getUserRole,
} from '@/modules/firebase/guards'
import { Role } from '@/modules/firebase/role'
import { mapUserData } from '@/modules/firebase/user'
import { type Organization } from '@/modules/firebase/utils'
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
  ]

  return mapUserData(userIdsToGet, (authData, id) => ({
    uid: id,
    email: authData.email,
    displayName: authData.displayName,
    role:
      adminIds.has(id) ? 'Admin'
      : clinicianIds.has(id) ? 'Clinician'
      : ownersIds.has(id) ? 'Owner'
      : '-',
  }))
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
