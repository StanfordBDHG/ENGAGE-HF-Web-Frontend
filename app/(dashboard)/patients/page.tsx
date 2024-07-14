//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { getDocs, query, where } from 'firebase/firestore'
import { getAuth } from 'firebase-admin/auth'
import { Contact } from 'lucide-react'
import { getAuthenticatedOnlyApp, getUserRole } from '@/modules/firebase/guards'
import { Role } from '@/modules/firebase/role'
import { getAdminApp } from '@/modules/firebase/utils'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { PatientsTable } from './PatientsTable'
import { DashboardLayout } from '../DashboardLayout'

const getPatientsQuery = async () => {
  const { refs } = await getAuthenticatedOnlyApp()
  const userRole = await getUserRole()
  if (userRole.role === Role.admin) return refs.users()
  if (userRole.role === Role.owner) {
    const organizationIds = userRole.organizations.docs.map((doc) => doc.id)
    return query(refs.users(), where('organization', 'in', organizationIds))
  }
  if (userRole.role === Role.clinician) {
    const organizationId = userRole.clinician.data().organization
    if (!organizationId) {
      // TODO: Check if there is any reason for organization not to be defined
      throw new Error('')
    }
    return query(refs.users(), where('organization', '==', organizationId))
  }
  // Other roles can't reach this point, so this should never execute
  throw new Error()
}

export const listPatients = async () => {
  const patientsQuery = await getPatientsQuery()
  const patients = await getDocs(patientsQuery)
  const userIdsToGet = patients.docs.map((patient) => ({ uid: patient.id }))

  const adminApp = getAdminApp()
  const adminAuth = getAuth(adminApp)

  // TODO: It can take max 100 users. Batch/paginate? Use getting by id? Fetch all and match?
  const users = await adminAuth.getUsers(userIdsToGet)
  const usersData = users.users.map((user) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  }))

  return usersData
}

const PatientsPage = async () => {
  const patients = await listPatients()

  return (
    <DashboardLayout title={<PageTitle title="Patients" icon={<Contact />} />}>
      <PatientsTable data={patients} />
    </DashboardLayout>
  )
}

export default PatientsPage
