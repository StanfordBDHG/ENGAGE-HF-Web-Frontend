//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { createFileRoute } from '@tanstack/react-router'
import { Home } from 'lucide-react'
import { Helmet } from 'react-helmet'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { DashboardLayout } from './DashboardLayout'

const DashboardPage = () => (
  <DashboardLayout title={<PageTitle title="Home" icon={<Home />} />}>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <h1 className="text-2xl">Dashboard</h1>
  </DashboardLayout>
)

export const Route = createFileRoute('/_dashboard/')({
  component: DashboardPage,
})
