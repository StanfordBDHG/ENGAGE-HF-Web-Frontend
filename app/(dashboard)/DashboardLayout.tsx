//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import Link from 'next/link'
import { LogoType } from '@/components/icons/LogoType'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { getUserInfo } from '@stanfordbdhg/design-system/modules/auth/user'
import {
  DashboardLayout as DashboardLayoutBase,
  type DashboardLayoutProps as DashboardLayoutPropsBase,
} from '@stanfordbdhg/design-system/molecules/DashboardLayout'
import { MenuLinks } from './MenuLinks'
import { User } from './User'

interface DashboardLayoutProps
  extends Omit<DashboardLayoutPropsBase, 'aside' | 'mobile'> {}

export const DashboardLayout = async (props: DashboardLayoutProps) => {
  const { currentUser, user: userDoc } = await getAuthenticatedOnlyApp()
  const role = userDoc.type
  const user = <User user={getUserInfo(currentUser)} />

  return (
    <DashboardLayoutBase
      aside={
        <>
          <Link href="/" className="interactive-opacity w-full pt-4">
            <LogoType className="!h-auto !w-full px-2 xl:px-8" />
          </Link>
          <nav className="mt-9 flex flex-col gap-1 xl:w-full">
            <MenuLinks userType={role} />
          </nav>
          {user}
        </>
      }
      mobile={
        <>
          <nav className="mt-9 flex flex-col gap-1 px-4">
            <MenuLinks userType={role} />
          </nav>
          {user}
        </>
      }
      {...props}
    />
  )
}
