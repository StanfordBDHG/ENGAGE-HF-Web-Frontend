//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type ReactNode } from 'react'
import { authenticatedOnly } from '../../modules/firebase/guards'

interface DashboardLayoutProps {
  children?: ReactNode
}

export const dynamic = 'force-dynamic'

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  await authenticatedOnly()
  return children
}

export default DashboardLayout
