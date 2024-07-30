//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { Contact } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getFormProps } from '@/app/(dashboard)/patients/utils'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { getDocDataOrThrow, UserType } from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { DashboardLayout } from '../../DashboardLayout'
import { PatientForm, type PatientFormSchema } from '../PatientForm'

const InvitePatientPage = async () => {
  const invitePatient = async (form: PatientFormSchema) => {
    'use server'
    const { callables, docRefs } = await getAuthenticatedOnlyApp()
    const clinician = await getDocDataOrThrow(docRefs.user(form.clinician))
    await callables.createInvitation({
      auth: {
        displayName: form.displayName,
        email: form.email,
      },
      user: {
        type: UserType.patient,
        clinician: form.clinician,
        organization: clinician.organization,
      },
    })
    redirect(routes.patients.index)
    // TODO: Confirmation message
  }

  return (
    <DashboardLayout
      title={<PageTitle title="Invite patient" icon={<Contact />} />}
    >
      <PatientForm onSubmit={invitePatient} {...await getFormProps()} />
    </DashboardLayout>
  )
}

export default InvitePatientPage
