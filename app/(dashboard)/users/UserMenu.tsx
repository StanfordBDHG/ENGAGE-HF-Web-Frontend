//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { Pencil, Trash } from 'lucide-react'
import Link from 'next/link'
import { deleteInvitation, deleteUser } from '@/app/(dashboard)/users/actions'
import type { User } from '@/app/(dashboard)/users/page'
import { useUser } from '@/modules/firebase/UserProvider'
import { routes } from '@/modules/routes'
import { RowDropdownMenu } from '@/packages/design-system/src/components/DataTable'
import { DropdownMenuItem } from '@/packages/design-system/src/components/DropdownMenu'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'
import { ConfirmDeleteDialog } from '@/packages/design-system/src/molecules/ConfirmDeleteDialog'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'

interface UserMenuProps {
  user: User
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const authUser = useUser()
  const deleteConfirm = useOpenState()

  const handleDelete = async () => {
    if (user.resourceType === 'user') {
      await deleteUser({ userId: user.resourceId })
    } else {
      await deleteInvitation({ invitationId: user.resourceId })
    }
    deleteConfirm.close()
  }

  return (
    <>
      <ConfirmDeleteDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setIsOpen}
        entityName={user.resourceType}
        itemName={getUserName(user)}
        onDelete={handleDelete}
      />
      <RowDropdownMenu>
        <DropdownMenuItem asChild>
          <Link href={routes.users.user(user.resourceId)}>
            <Pencil />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={deleteConfirm.open}
          disabled={authUser.auth.uid === user.uid}
        >
          <Trash />
          Delete
        </DropdownMenuItem>
      </RowDropdownMenu>
    </>
  )
}
