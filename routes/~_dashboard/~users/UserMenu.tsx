//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { deleteDoc } from '@firebase/firestore'
import { RowDropdownMenu } from '@stanfordbdhg/spezi-web-design-system/components/DataTable'
import { DropdownMenuItem } from '@stanfordbdhg/spezi-web-design-system/components/DropdownMenu'
import { getUserName } from '@stanfordbdhg/spezi-web-design-system/modules/auth'
import { ConfirmDeleteDialog } from '@stanfordbdhg/spezi-web-design-system/molecules/ConfirmDeleteDialog'
import { useOpenState } from '@stanfordbdhg/spezi-web-design-system/utils/useOpenState'
import { Link, useRouter } from '@tanstack/react-router'
import { Pencil, Trash } from 'lucide-react'
import { callables, docRefs } from '@/modules/firebase/app'
import { useUser } from '@/modules/firebase/UserProvider'
import { routes } from '@/modules/routes'
import { type User } from '@/routes/~_dashboard/~users/~index'

interface UserMenuProps {
  user: User
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const router = useRouter()
  const authUser = useUser()
  const deleteConfirm = useOpenState()

  const handleDelete = async () => {
    if (user.resourceType === 'user') {
      await callables.deleteUser({ userId: user.resourceId })
    } else {
      await deleteDoc(docRefs.invitation(user.resourceId))
    }
    deleteConfirm.close()
    void router.invalidate()
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
          <Link to={routes.users.user(user.resourceId)}>
            <Pencil />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={deleteConfirm.open}
          disabled={authUser.auth.uid === user.resourceId}
        >
          <Trash />
          Delete
        </DropdownMenuItem>
      </RowDropdownMenu>
    </>
  )
}
