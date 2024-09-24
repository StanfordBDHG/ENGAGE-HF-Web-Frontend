import { UserType } from '@stanfordbdhg/engagehf-models'
import { type Query, query, where } from 'firebase/firestore'
import { type Invitation, type User } from '@/modules/firebase/models'
import { mapAuthData } from '@/modules/firebase/user'
import { getDocsData } from '@/modules/firebase/utils'
import {
  getUserOrganizationsMap,
  parseAuthToUser,
  parseInvitationToUser,
} from '@/modules/user/queries'

export const parsePatientsQueries = async ({
  patientsQuery,
  invitationsQuery,
}: {
  patientsQuery: Query<User>
  invitationsQuery: Query<Invitation>
}) => {
  const patients = await getDocsData(
    query(patientsQuery, where('type', '==', UserType.patient)),
  )

  const userIds = patients.map((patient) => patient.id)
  const organizationMap = await getUserOrganizationsMap()

  const invitations = await getDocsData(
    query(invitationsQuery, where('user.type', '==', UserType.patient)),
  )

  const patientsData = await mapAuthData(
    { userIds, includeUserData: true },
    ({ auth, user }, id) => ({
      ...parseAuthToUser(id, auth),
      organization: organizationMap.get(user?.organization ?? ''),
    }),
  )

  const invitedUsers = invitations.map((invitation) =>
    parseInvitationToUser(invitation, organizationMap),
  )

  return [...invitedUsers, ...patientsData]
}
