//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { Contact } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { getDocsData } from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { DashboardLayout } from '../../DashboardLayout'
import { PatientForm, type PatientFormSchema } from '../PatientForm'

const CreatePatientPage = async () => {
  const { refs } = await getAuthenticatedOnlyApp()
  const organizations = await getDocsData(refs.organizations())

  const createPatient = async (form: PatientFormSchema) => {
    'use server'
    const { callables } = await getAuthenticatedOnlyApp()
    await callables.createInvitation({
      auth: {
        displayName: form.displayName,
        email: form.email,
        phoneNumber: null,
        photoURL: null,
      },
      // TODO
      patient: {},
      user: { organization: form.organizationId },
    })
    redirect(routes.patients.index)
    // TODO: Confirmation message
  }

  return (
    <DashboardLayout
      title={<PageTitle title="Create patient" icon={<Contact />} />}
    >
      <PatientForm organizations={organizations} onSubmit={createPatient} />
    </DashboardLayout>
  )
}

export default CreatePatientPage
