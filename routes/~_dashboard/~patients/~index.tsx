//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { UserType } from '@stanfordbdhg/engagehf-models'
import { createFileRoute, Link } from '@tanstack/react-router'
import { query, where } from 'firebase/firestore'
import { Contact, UserPlus } from 'lucide-react'
import {
  docRefs,
  getCurrentUser,
  getCurrentUserType,
  refs,
} from '@/modules/firebase/app'
import { mapAuthData } from '@/modules/firebase/user'
import { getDocData, getDocsData } from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import {
  getNonAdminInvitations,
  getUserOrganizationsMap,
  parseAuthToUser,
  parseInvitationToUser,
} from '@/modules/user/queries'
import { Button } from '@/packages/design-system/src/components/Button'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { DashboardLayout } from '@/routes/~_dashboard/DashboardLayout'
import { PatientsTable } from '@/routes/~_dashboard/~patients/PatientsTable'

const getData = async () => {
  const { currentUser } = await getCurrentUser()
  const user = await getDocData(docRefs.user(currentUser.uid))
  const organizationId = user?.organization
  if (!organizationId)
    throw new Error('Clinician/owner without organization id')
  return {
    patientsQuery: query(
      refs.users(),
      where('organization', '==', organizationId),
    ),
    invitationsQuery: getNonAdminInvitations([organizationId]),
  }
}

const getAdminData = () => ({
  patientsQuery: refs.users(),
  invitationsQuery: refs.invitations(),
})

const listPatients = async () => {
  const userRole = await getCurrentUserType()
  const { patientsQuery, invitationsQuery } =
    userRole === UserType.admin ? getAdminData() : await getData()
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

const PatientsPage = () => {
  const patients = Route.useLoaderData()

  return (
    <DashboardLayout
      title={<PageTitle title="Patients" icon={<Contact />} />}
      actions={
        <Button asChild>
          <Link to={routes.patients.invite}>
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

export const Route = createFileRoute('/_dashboard/patients/')({
  component: PatientsPage,
  loader: () => listPatients(),
})
