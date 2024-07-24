import { query, where } from 'firebase/firestore'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { Role } from '@/modules/firebase/role'
import {
  type Invitation,
  type Organization,
  UserAuthenticationInformation,
} from '@/modules/firebase/utils'

export const getNonAdminInvitations = async (organizationIds: string[]) => {
  const { refs } = await getAuthenticatedOnlyApp()
  return query(
    refs.invitations(),
    where('user.organization', 'in', organizationIds),
    where('admin', '==', null),
  )
}

export const parseInvitationToUser = (
  invitation: Invitation,
  organizationMap: Map<string, Organization>,
) => ({
  resourceId: invitation.id,
  resourceType: 'invitation' as const,
  uid: invitation.userId,
  email: invitation.auth?.email,
  displayName: invitation.auth?.displayName,
  organization: organizationMap.get(invitation.user?.organization ?? ''),
  role:
    invitation.patient ? Role.user
    : invitation.admin ? Role.admin
    : invitation.clinician ? Role.clinician
    : Role.owner,
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
