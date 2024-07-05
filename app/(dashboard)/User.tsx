'use client'

import { LogOut } from 'lucide-react'
import { auth } from '../../modules/firebase/clientApp'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../packages/design-system/src/components/DropdownMenu'
import {
  getUserName,
  type UserInfo,
} from '../../packages/design-system/src/modules/auth/user'
import { UserMenuItem } from '../../packages/design-system/src/molecules/DashboardLayout/User'

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
