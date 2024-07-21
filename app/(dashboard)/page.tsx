//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { Home } from 'lucide-react'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { Check } from './Check'
import { DashboardLayout } from './DashboardLayout'

const DashboardPage = () => {
  const seed = async () => {
    'use server'
    const { callables } = await getAuthenticatedOnlyApp()
    await callables.seedEmulator()
    return 'success'
  }

  return (
    <DashboardLayout title={<PageTitle title="Home" icon={<Home />} />}>
      <h1 className="text-2xl">Dashboard</h1>
      <Check seed={seed} />
    </DashboardLayout>
  )
}

export default DashboardPage
