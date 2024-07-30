//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { query, where } from 'firebase/firestore'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import {
  getDocDataOrThrow,
  getDocsData,
  type Invitation,
  type Organization,
  type UserAuthenticationInformation,
  UserType,
} from '@/modules/firebase/utils'

export const getNonAdminInvitations = async (organizationIds: string[]) => {
  const { refs } = await getAuthenticatedOnlyApp()
  return query(
    refs.invitations(),
    where('user.organization', 'in', organizationIds),
    where('user.type', '!=', UserType.admin),
  )
}

export const parseInvitationToUser = (
  invitation: Invitation & { id: string },
  organizationMap: Map<string, Organization>,
) => ({
  resourceId: invitation.id,
  resourceType: 'invitation' as const,
  uid: invitation.userId,
  email: invitation.auth?.email,
  displayName: invitation.auth?.displayName,
  organization: organizationMap.get(invitation.user?.organization ?? ''),
  type: invitation.user?.type,
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

export const getUserOrganizations = async () => {
  const { user, refs, docRefs } = await getAuthenticatedOnlyApp()
  let organizations: Array<Organization & { id: string }> = []
  if (user.type === UserType.admin) {
    organizations = await getDocsData(refs.organizations())
  } else if (user.organization) {
    organizations = [
      await getDocDataOrThrow(docRefs.organization(user.organization)),
    ]
  }
  return organizations
}

export const getUserOrganizationsMap = async () => {
  const organizations = await getUserOrganizations()
  return new Map(
    organizations.map(
      (organization) => [organization.id, organization] as const,
    ),
  )
}
