//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type Meta } from '@storybook/react'
import { LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from './DropdownMenu'
import { Button } from '../Button'

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
}

export default meta

export const Triggerable = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>
        <LogOut className="size-4" />
        Action one
      </DropdownMenuItem>
      <DropdownMenuItem>
        <LogOut className="size-4" />
        Action two
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

export const Simple = () => (
  <DropdownMenu open={true}>
    <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>
        <LogOut className="size-4" />
        Action one
      </DropdownMenuItem>
      <DropdownMenuItem>
        <LogOut className="size-4" />
        Action two
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

export const Complex = () => (
  <DropdownMenu open={true}>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">Trigger</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <LogOut className="size-4" />
          <span>Profile</span>
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <LogOut className="size-4" />
          <span>Billing</span>
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut className="size-4" />
          <span>Settings</span>
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut className="size-4" />
          <span>Keyboard shortcuts</span>
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <LogOut className="size-4" />
            <span>Invite users</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <LogOut className="size-4" />
                <span>Email</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="size-4" />
                <span>Message</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="size-4" />
                <span>More...</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <LogOut className="size-4" />
        <span>Log out</span>
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)
