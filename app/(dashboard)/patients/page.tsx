//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { query, where } from 'firebase/firestore'
import { Contact, UserPlus } from 'lucide-react'
import Link from 'next/link'
import {
  getAuthenticatedOnlyApp,
  getCurrentUserType,
} from '@/modules/firebase/guards'
import { mapAuthData } from '@/modules/firebase/user'
import { getDocData, getDocsData, UserType } from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import {
  getNonAdminInvitations,
  getUserOrganizationsMap,
  parseAuthToUser,
  parseInvitationToUser,
} from '@/modules/user/queries'
import { Button } from '@/packages/design-system/src/components/Button'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { PatientsTable } from './PatientsTable'
import { DashboardLayout } from '../DashboardLayout'

const getData = async () => {
  const { refs, currentUser, docRefs } = await getAuthenticatedOnlyApp()
  const user = await getDocData(docRefs.user(currentUser.uid))
  const organizationId = user?.organization
  if (!organizationId)
    throw new Error('Clinician/owner without organization id')
  return {
    patientsQuery: query(
      refs.users(),
      where('organization', '==', organizationId),
    ),
    invitationsQuery: await getNonAdminInvitations([organizationId]),
  }
}

const getAdminData = async () => {
  const { refs } = await getAuthenticatedOnlyApp()
  return {
    patientsQuery: refs.users(),
    invitationsQuery: refs.invitations(),
  }
}

const listPatients = async () => {
  const userRole = await getCurrentUserType()
  const { patientsQuery, invitationsQuery } =
    userRole === UserType.admin ? await getAdminData() : await getData()
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

export type Patient = Awaited<ReturnType<typeof listPatients>>[number]

const PatientsPage = async () => {
  const patients = await listPatients()

  return (
    <DashboardLayout
      title={<PageTitle title="Patients" icon={<Contact />} />}
      actions={
        <Button asChild>
          <Link href={routes.patients.invite}>
            <UserPlus />
            Invite Patient
          </Link>
        </Button>
      }
    >
      <PatientsTable data={patients} />
    </DashboardLayout>
  )
}

export default PatientsPage
