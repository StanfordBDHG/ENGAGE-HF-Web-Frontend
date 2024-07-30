//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type ReactNode } from 'react'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { UserContextProvider } from '@/modules/firebase/UserProvider'
import { getDocDataOrThrow } from '@/modules/firebase/utils'
import { getUserInfo } from '@/packages/design-system/src/modules/auth/user'

interface DashboardLayoutProps {
  children?: ReactNode
}

export const dynamic = 'force-dynamic'

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const { currentUser, docRefs } = await getAuthenticatedOnlyApp()
  const user = await getDocDataOrThrow(docRefs.user(currentUser.uid))
  return (
    <UserContextProvider
      user={{
        auth: getUserInfo(currentUser),
        user,
      }}
    >
      {children}
    </UserContextProvider>
  )
}

export default DashboardLayout
