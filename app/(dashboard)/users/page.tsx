//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { Users } from 'lucide-react'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { DashboardLayout } from '../DashboardLayout'

const UsersPage = () => (
  <DashboardLayout title={<PageTitle title="Users" icon={<Users />} />}>
    Data
  </DashboardLayout>
)

export default UsersPage
