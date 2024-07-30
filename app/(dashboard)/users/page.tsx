//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { query, where } from 'firebase/firestore'
import { UserPlus, Users } from 'lucide-react'
import Link from 'next/link'
import { allowTypes, getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { mapAuthData } from '@/modules/firebase/user'
import { getDocsData, UserType } from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import {
  getUserOrganizationsMap,
  parseAuthToUser,
  parseInvitationToUser,
} from '@/modules/user/queries'
import { Button } from '@/packages/design-system/src/components/Button'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { UsersTable } from './UsersTable'
import { DashboardLayout } from '../DashboardLayout'

const getAdminData = async () => {
  const { refs } = await getAuthenticatedOnlyApp()

  return {
    usersQuery: refs.users(),
    invitationsQuery: refs.invitations(),
  }
}

const getOwnerData = async () => {
  const { refs, user } = await getAuthenticatedOnlyApp()

  if (!user.organization) throw new Error('User without organization')
  return {
    usersQuery: query(
      refs.users(),
      where('organization', '==', user.organization),
    ),
    invitationsQuery: query(
      refs.invitations(),
      where('user.organization', '==', user.organization),
    ),
  }
}

const listUsers = async () => {
  const { user } = await getAuthenticatedOnlyApp()
  const { usersQuery, invitationsQuery } =
    user.type === UserType.admin ? await getAdminData() : await getOwnerData()

  const organizationMap = await getUserOrganizationsMap()
  const invitations = await getDocsData(
    query(invitationsQuery, where('user.type', '!=', UserType.patient)),
  )
  const usersData = await getDocsData(
    query(usersQuery, where('type', '!=', UserType.patient)),
  )
  const userIds = usersData.map((user) => user.id)

  const users = await mapAuthData(
    { userIds, includeUserData: true },
    ({ auth, user }, id) => ({
      ...parseAuthToUser(id, auth),
      organization: organizationMap.get(user?.organization ?? ''),
      type: user?.type,
    }),
  )

  const invitedUsers = invitations.map((invitation) =>
    parseInvitationToUser(invitation, organizationMap),
  )

  return [...invitedUsers, ...users]
}

export type User = Awaited<ReturnType<typeof listUsers>>[number]

const UsersPage = async () => {
  await allowTypes([UserType.admin, UserType.owner])
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
