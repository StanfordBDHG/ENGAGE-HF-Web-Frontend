//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { Home } from 'lucide-react'
import Link from 'next/link'
import { type ReactNode } from 'react'
import { LogoType } from '@/components/icons/LogoType'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { getUserInfo } from '@stanfordbdhg/design-system/modules/auth/user'
import {
  DashboardLayout as DashboardLayoutBase,
  MenuItem,
  PageTitle,
} from '@stanfordbdhg/design-system/molecules/DashboardLayout'
import { User } from './User'

interface DashboardLayoutProps {
  children?: ReactNode
}

export const dynamic = 'force-dynamic'

const MenuLinks = () => (
  <>
    <MenuItem href="/" label="Home" icon={<Home />} isActive />
  </>
)

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const { currentUser } = await getAuthenticatedOnlyApp()

  const user = <User user={getUserInfo(currentUser)} />

  return (
    <DashboardLayoutBase
      aside={
        <>
          <Link href="/" className="interactive-opacity w-full pt-4">
            <LogoType className="!h-auto !w-full px-2 xl:px-8" />
          </Link>
          <nav className="mt-9 flex flex-col gap-1 xl:w-full">
            <MenuLinks />
          </nav>
          {user}
        </>
      }
      mobile={
        <>
          <nav className="mt-9 flex flex-col gap-1 px-4">
            <MenuLinks />
          </nav>
          {user}
        </>
      }
      title={<PageTitle icon={<Home />} title="Home" />}
    >
      {children}
    </DashboardLayoutBase>
  )
}

export default DashboardLayout
