//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { uniq } from 'es-toolkit'
import { getDocs, query, where } from 'firebase/firestore'
import { Users, UserPlus } from 'lucide-react'
import Link from 'next/link'
import {
  allowRoles,
  getAuthenticatedOnlyApp,
  getCurrentUserRole,
} from '@/modules/firebase/guards'
import { Role } from '@/modules/firebase/role'
import { mapAuthData } from '@/modules/firebase/user'
import { getDocsData, type Organization } from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import { Button } from '@/packages/design-system/src/components/Button'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { UsersTable } from './UsersTable'
import { DashboardLayout } from '../DashboardLayout'

const getAdminData = async () => {
  const { refs } = await getAuthenticatedOnlyApp()

  const admins = await getDocs(refs.admins())
  const adminIds = new Set(admins.docs.map((admin) => admin.id))

  return {
    adminIds,
    organizations: await getDocsData(refs.organizations()),
    cliniciansQuery: refs.clinicians(),
    invitationsQuery: refs.invitations(),
  }
}

const getOwnerData = async (organizations: Organization[]) => {
  const { refs } = await getAuthenticatedOnlyApp()
  const organizationIds = organizations.map((organization) => organization.id)
  const cliniciansQuery = query(
    refs.clinicians(),
    where('organization', 'in', organizationIds),
  )

  return {
    adminIds: new Set<string>(),
    organizations,
    cliniciansQuery,
    invitationsQuery: query(
      refs.invitations(),
      where('user.organization', 'in', organizationIds),
    ),
  }
}

const listUsers = async () => {
  const role = await getCurrentUserRole()
  const { adminIds, organizations, cliniciansQuery, invitationsQuery } =
    role.role === Role.admin ?
      await getAdminData()
    : await getOwnerData(role.organizations ?? [])

  const organizationMap = new Map(
    organizations.map(
      (organization) => [organization.id, organization] as const,
    ),
  )

  const clinicians = await getDocs(cliniciansQuery)
  const clinicianIds = new Set(clinicians.docs.map((clinician) => clinician.id))

  const invitations = await getDocsData(
    query(invitationsQuery, where('patient', '==', null)),
  )

  const ownersIds = new Set(
    organizations.flatMap((organization) => organization.owners),
  )

  const userIds = uniq([
    ...adminIds.values(),
    ...clinicianIds.values(),
    ...ownersIds.values(),
  ])

  const users = await mapAuthData(
    { userIds, includeUserData: true },
    ({ auth, user }, id) => ({
      resourceId: id,
      uid: id,
      email: auth.email,
      displayName: auth.displayName,
      organization: organizationMap.get(user?.organization ?? ''),
      isInvitation: false,
      role:
        adminIds.has(id) ? Role.admin
        : ownersIds.has(id) ? Role.owner
        : clinicianIds.has(id) ? Role.clinician
        : Role.user, // this shouldn't be reachable
    }),
  )

  const invitedUsers = invitations.map((invitation) => ({
    resourceId: invitation.id,
    uid: invitation.userId,
    email: invitation.auth?.email,
    displayName: invitation.auth?.displayName,
    organization: organizationMap.get(invitation.user?.organization ?? ''),
    isInvitation: true,
    role:
      invitation.patient ? Role.user
      : invitation.admin ? Role.admin
      : invitation.clinician ? Role.clinician
      : Role.owner, // owner is the only Role that's left
  }))

  return [...invitedUsers, ...users]
}

export type User = Awaited<ReturnType<typeof listUsers>>[number]

const UsersPage = async () => {
  await allowRoles([Role.admin, Role.owner])
  const users = await listUsers()

  return (
    <DashboardLayout
      actions={
        <Button asChild>
          <Link href={routes.users.invite}>
            <UserPlus />
            Invite User
          </Link>
        </Button>
      }
      title={<PageTitle title="Users" icon={<Users />} />}
    >
      <UsersTable data={users} />
    </DashboardLayout>
  )
}

export default UsersPage
