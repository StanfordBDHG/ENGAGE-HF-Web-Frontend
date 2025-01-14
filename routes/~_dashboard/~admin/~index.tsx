//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { UserType } from '@stanfordbdhg/engagehf-models'
import { PageTitle } from '@stanfordspezi/spezi-web-design-system/molecules/DashboardLayout'
import { createFileRoute } from '@tanstack/react-router'
import { MonitorCog } from 'lucide-react'
import { Helmet } from 'react-helmet'
import { ensureType } from '@/modules/firebase/app'
import { DashboardLayout } from '../DashboardLayout'

const AdminPage = () => (
  <DashboardLayout title={<PageTitle title="Admin" icon={<MonitorCog />} />}>
    <Helmet>
      <title>Admin</title>
    </Helmet>
    <p>Admin</p>
  </DashboardLayout>
)

export const Route = createFileRoute('/_dashboard/admin/')({
  component: AdminPage,
  beforeLoad: () => ensureType([UserType.admin]),
})
