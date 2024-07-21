//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type ReactNode } from 'react'
import {
  getAuthenticatedOnlyApp,
  getCurrentUserRole,
} from '@/modules/firebase/guards'
import { UserContextProvider } from '@/modules/firebase/UserProvider'
import { getUserInfo } from '@/packages/design-system/src/modules/auth/user'

interface DashboardLayoutProps {
  children?: ReactNode
}

export const dynamic = 'force-dynamic'

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const { currentUser } = await getAuthenticatedOnlyApp()
  const { role } = await getCurrentUserRole()
  return (
    <UserContextProvider
      user={{
        ...getUserInfo(currentUser),
        role,
      }}
    >
      {children}
    </UserContextProvider>
  )
}

export default DashboardLayout
