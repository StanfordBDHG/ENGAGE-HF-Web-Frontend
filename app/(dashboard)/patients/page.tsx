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
  getCurrentUserRole,
} from '@/modules/firebase/guards'
import { Role } from '@/modules/firebase/role'
import { mapAuthData } from '@/modules/firebase/user'
import { getDocData, getDocsData } from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import {
  getNonAdminInvitations,
  parseAuthToUser,
  parseInvitationToUser,
} from '@/modules/user/queries'
import { Button } from '@/packages/design-system/src/components/Button'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { PatientsTable } from './PatientsTable'
import { DashboardLayout } from '../DashboardLayout'

const getData = async () => {
  const { refs, currentUser, docRefs } = await getAuthenticatedOnlyApp()
  const userRole = await getCurrentUserRole()
  const user = await getDocData(docRefs.user(currentUser.uid))
  const organizationId = user?.organization
  // TODO: Check if there is any reason for organization not to be defined
  if (!organizationId)
    throw new Error('Clinician/admin without organization id')
  return {
    patientsQuery: query(
      refs.users(),
      where('organization', '==', organizationId),
    ),
    organizations: userRole.organizations ?? [],
    invitationsQuery: await getNonAdminInvitations([organizationId]),
  }
}

const getAdminData = async () => {
  const { refs } = await getAuthenticatedOnlyApp()
  return {
    patientsQuery: refs.users(),
    organizations: await getDocsData(refs.organizations()),
    invitationsQuery: refs.invitations(),
  }
}

const listPatients = async () => {
  const userRole = await getCurrentUserRole()
  const { patientsQuery, organizations, invitationsQuery } =
    userRole.role === Role.admin ? await getAdminData() : await getData()
  const patients = await getDocsData(patientsQuery)

  const userIds = patients.map((patient) => patient.id)
  const patientsById = new Map(
    patients.map((patient) => [patient.id, patient] as const),
  )
  const organizationMap = new Map(
    organizations.map(
      (organization) => [organization.id, organization] as const,
    ),
  )
  const invitations = await getDocsData(
    query(invitationsQuery, where('patient', '==', null)),
  )

  const patientsData = await mapAuthData(
    { userIds, includeUserData: true },
    ({ auth, user }, id) => {
      const patient = patientsById.get(id)
      if (!patient) {
        console.error(`No patient found for user id ${id}`)
        return null
      }
      return {
        ...parseAuthToUser(id, auth),
        organization: organizationMap.get(user?.organization ?? ''),
      }
    },
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
