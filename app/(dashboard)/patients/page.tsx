//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { getDoc, getDocs, query, where } from 'firebase/firestore'
import { Contact, UserPlus } from 'lucide-react'
import Link from 'next/link'
import {
  getAuthenticatedOnlyApp,
  getCurrentUserRole,
} from '@/modules/firebase/guards'
import { Role } from '@/modules/firebase/role'
import { mapAuthData } from '@/modules/firebase/user'
import { routes } from '@/modules/routes'
import { Button } from '@/packages/design-system/src/components/Button'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { PatientsTable } from './PatientsTable'
import { DashboardLayout } from '../DashboardLayout'

const getPatientsQuery = async () => {
  const { refs, currentUser, docRefs } = await getAuthenticatedOnlyApp()
  const userRole = await getCurrentUserRole()
  if (userRole.role === Role.admin) return refs.users()
  if (userRole.role === Role.owner) {
    const organizationIds = userRole.organizations.map(
      (organization) => organization.id,
    )
    return query(refs.users(), where('organization', 'in', organizationIds))
  }
  if (userRole.role === Role.clinician) {
    const user = docRefs.user(currentUser.uid)
    const userDoc = await getDoc(user)
    const organizationId = userDoc.data()?.organization
    // TODO: Check if there is any reason for organization not to be defined
    if (!organizationId) throw new Error('Clinician without organization id')
    return query(refs.users(), where('organization', '==', organizationId))
  }
  // Other roles can't reach this point, so this should never execute
  throw new Error()
}

const listPatients = async () => {
  const patientsQuery = await getPatientsQuery()
  const patients = await getDocs(patientsQuery)
  const userIds = patients.docs.map((patient) => patient.id)
  const patientsById = new Map(
    patients.docs.map(
      (patient) => [patient.id, { id: patient.id, ...patient.data() }] as const,
    ),
  )

  return mapAuthData({ userIds }, ({ auth }, id) => {
    const patient = patientsById.get(id)
    if (!patient) {
      console.error(`No patient found for user id ${id}`)
      return null
    }
    return {
      uid: id,
      email: auth.email,
      displayName: auth.displayName,
    }
  })
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
