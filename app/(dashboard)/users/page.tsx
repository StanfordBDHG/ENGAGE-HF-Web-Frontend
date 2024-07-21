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
  const { callables } = await getAuthenticatedOnlyApp()
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

  // TODO: It can take max 100 users. Batch/paginate? Use getting by id? Fetch all and match?
  const usersRecord = await callables.getUsersInformation({
    userIds: userIdsToGet,
  })
  return userIdsToGet
    .map((id) => {
      // authData might be undefined
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const authData = usersRecord.data[id]?.data?.auth
      // TODO: At least log the error here
      if (!authData) return null
      return {
        uid: id,
        email: authData.email,
        displayName: authData.displayName,
        role:
          adminIds.has(id) ? 'Admin'
          : clinicianIds.has(id) ? 'Clinician'
          : ownersIds.has(id) ? 'Owner'
          : '-',
      }
    })
    .filter(Boolean)
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
