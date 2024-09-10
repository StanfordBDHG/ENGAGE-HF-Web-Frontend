//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { UserType } from '@stanfordbdhg/engagehf-models'
import { queryOptions } from '@tanstack/react-query'
import { query, where } from 'firebase/firestore'
import { queryClient } from '@/app/ReactQueryClientProvider'
import { docRefs, getCurrentUser, refs } from '@/modules/firebase/app'
import { type Invitation, type Organization } from '@/modules/firebase/models'
import { mapAuthData } from '@/modules/firebase/user'
import {
  getDocData,
  getDocDataOrThrow,
  getDocsData,
  type UserAuthenticationInformation,
} from '@/modules/firebase/utils'

export const getNonAdminInvitations = (organizationIds: string[]) =>
  query(
    refs.invitations(),
    where('user.organization', 'in', organizationIds),
    where('user.type', '!=', UserType.admin),
  )

export const parseInvitationToUser = (
  invitation: Invitation & { id: string },
  organizationMap: Map<string, Organization>,
) => ({
  resourceId: invitation.id,
  resourceType: 'invitation' as const,
  uid: invitation.userId,
  email: invitation.auth?.email,
  displayName: invitation.auth?.displayName,
  organization: organizationMap.get(invitation.user.organization ?? ''),
  type: invitation.user.type,
})

export const parseAuthToUser = (
  id: string,
  auth: UserAuthenticationInformation,
) => ({
  resourceId: id,
  resourceType: 'user' as const,
  uid: id,
  email: auth.email,
  displayName: auth.displayName,
})

export const userOrganizationQueryOptions = () =>
  queryOptions({
    queryKey: ['userOrganizations'],
    queryFn: async () => {
      const { user } = await getCurrentUser()
      let organizations: Array<Organization & { id: string }> = []
      if (user.type === UserType.admin) {
        organizations = await getDocsData(refs.organizations())
      } else if (user.organization) {
        organizations = [
          await getDocDataOrThrow(docRefs.organization(user.organization)),
        ]
      }
      return organizations
    },
  })

export const getUserOrganizationsMap = async () => {
  const organizations = await queryClient.ensureQueryData(
    userOrganizationQueryOptions(),
  )
  return new Map(
    organizations.map(
      (organization) => [organization.id, organization] as const,
    ),
  )
}

/**
 * Gets user or invitation data
 * */
export const getUserData = async (userId: string) => {
  const user = await getDocData(docRefs.user(userId))
  if (user) {
    const allAuthData = await mapAuthData(
      { userIds: [userId] },
      (data, id) => ({
        uid: id,
        email: data.auth.email,
        displayName: data.auth.displayName,
      }),
    )
    const authUser = allAuthData.at(0)
    return { user, authUser, resourceType: 'user' as const }
  }
  const invitation = await getDocData(docRefs.invitation(userId))
  return {
    user:
      invitation?.user ?
        {
          ...invitation.user,
          invitationCode: invitation.id,
        }
      : undefined,
    authUser:
      invitation?.auth ?
        {
          uid: userId,
          email: invitation.auth.email ?? null,
          displayName: invitation.auth.displayName ?? null,
        }
      : undefined,
    resourceType: 'invitation' as const,
  }
}
