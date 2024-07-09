//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { LogOut } from 'lucide-react'
import { auth } from '@/modules/firebase/clientApp'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@stanfordbdhg/design-system/components/DropdownMenu'
import {
  getUserName,
  type UserInfo,
} from '@stanfordbdhg/design-system/modules/auth/user'
import { UserMenuItem } from '@stanfordbdhg/design-system/molecules/DashboardLayout'

interface UserProps {
  user: UserInfo
}

export const User = ({ user }: UserProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <UserMenuItem img={user.photoURL} name={getUserName(user)} />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem
        onClick={async () => {
          await auth.signOut()
        }}
      >
        <LogOut className="size-4" />
        Sign Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)
