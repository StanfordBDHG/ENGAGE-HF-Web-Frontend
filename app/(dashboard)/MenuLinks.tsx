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
import { Role } from '@/modules/firebase/role'
import { MenuItem } from '@stanfordbdhg/design-system/molecules/DashboardLayout'

interface MenuLinksProps {
  role: Role
}

export const MenuLinks = ({ role }: MenuLinksProps) => {
  const pathname = usePathname()

  const hrefProps = (href: string) => ({
    href,
    isActive: pathname === href,
  })

  return (
    <>
      <MenuItem {...hrefProps('/')} label="Home" icon={<Home />} />
      {role === Role.admin && (
        <MenuItem {...hrefProps('/users')} label="Users" icon={<Users />} />
      )}
      <MenuItem
        {...hrefProps('/patients')}
        label="Patients"
        icon={<Contact />}
      />
    </>
  )
}
