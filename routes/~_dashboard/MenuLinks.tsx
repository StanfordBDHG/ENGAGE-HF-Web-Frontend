//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { UserType } from '@stanfordbdhg/engagehf-models'
import { MenuItem } from '@stanfordspezi/spezi-web-design-system/molecules/DashboardLayout'
import { useLocation } from '@tanstack/react-router'
import { Home, Users, Contact, Bell } from 'lucide-react'
import { useHasUnreadNotification } from '@/modules/notifications/queries'
import { routes } from '@/modules/routes'

interface MenuLinksProps {
  userType: UserType
}

export const MenuLinks = ({ userType }: MenuLinksProps) => {
  const location = useLocation()

  const hrefProps = (href: string) => ({
    href,
    isActive: location.pathname === href,
  })

  const { hasUnreadNotification } = useHasUnreadNotification()

  return (
    <>
      <MenuItem {...hrefProps('/')} label="Home" icon={<Home />} />
      <MenuItem
        {...hrefProps(routes.notifications)}
        label="Notifications"
        isHighlighted={hasUnreadNotification}
        icon={<Bell />}
      />
      {[UserType.admin, UserType.owner].includes(userType) && (
        <MenuItem
          {...hrefProps(routes.users.index)}
          label="Users"
          icon={<Users />}
        />
      )}
      <MenuItem
        {...hrefProps(routes.patients.index)}
        label="Patients"
        icon={<Contact />}
      />
    </>
  )
}
