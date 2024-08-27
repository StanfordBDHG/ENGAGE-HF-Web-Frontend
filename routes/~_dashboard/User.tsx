//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { LogOut } from 'lucide-react'
import { auth } from '@/modules/firebase/guards'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/packages/design-system/src/components/DropdownMenu'
import {
  getUserName,
  type UserInfo,
} from '@/packages/design-system/src/modules/auth/user'
import { UserMenuItem } from '@/packages/design-system/src/molecules/DashboardLayout'

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
        <LogOut />
        Sign Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)
