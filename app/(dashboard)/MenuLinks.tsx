//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { Home, Users, Contact } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { UserType } from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import { MenuItem } from '@stanfordbdhg/design-system/molecules/DashboardLayout'

interface MenuLinksProps {
  userType: UserType
}

export const MenuLinks = ({ userType }: MenuLinksProps) => {
  const pathname = usePathname()

  const hrefProps = (href: string) => ({
    href,
    isActive: pathname === href,
  })

  return (
    <>
      <MenuItem {...hrefProps('/')} label="Home" icon={<Home />} />
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
