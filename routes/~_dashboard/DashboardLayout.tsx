//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { Link } from '@tanstack/react-router'
import { LogoType } from '@/components/icons/LogoType'
import { useUser } from '@/modules/firebase/UserProvider'
import { getUserInfo } from '@/packages/design-system/src/modules/auth/user'
import {
  DashboardLayout as DashboardLayoutBase,
  type DashboardLayoutProps as DashboardLayoutPropsBase,
} from '@/packages/design-system/src/molecules/DashboardLayout'
import { MenuLinks } from '@/routes/~_dashboard/MenuLinks'
import { User } from '@/routes/~_dashboard/User'

interface DashboardLayoutProps
  extends Omit<DashboardLayoutPropsBase, 'aside' | 'mobile'> {}

export const DashboardLayout = (props: DashboardLayoutProps) => {
  const { user, auth } = useUser()
  const role = user.type
  const userUI = <User user={getUserInfo(auth)} />

  return (
    <DashboardLayoutBase
      aside={
        <>
          <Link to="/" className="interactive-opacity w-full pt-4">
            <LogoType className="!h-auto !w-full px-2 xl:px-8" />
          </Link>
          <nav className="mt-9 flex flex-col gap-1 xl:w-full">
            <MenuLinks userType={role} />
          </nav>
          {userUI}
        </>
      }
      mobile={
        <>
          <nav className="mt-9 flex flex-col gap-1 px-4">
            <MenuLinks userType={role} />
          </nav>
          {userUI}
        </>
      }
      {...props}
    />
  )
}
