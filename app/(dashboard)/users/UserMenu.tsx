'use client'
import { Pencil, Trash } from 'lucide-react'
import { deleteUser } from '@/app/(dashboard)/users/actions'
import type { User } from '@/app/(dashboard)/users/page'
import { useUser } from '@/modules/firebase/UserProvider'
import { RowDropdownMenu } from '@/packages/design-system/src/components/DataTable'
import { DropdownMenuItem } from '@/packages/design-system/src/components/DropdownMenu'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'
import { ConfirmDeleteDialog } from '@/packages/design-system/src/molecules/ConfirmDeleteDialog'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'
import Link from 'next/link'
import { routes } from '@/modules/routes'

interface UserMenuProps {
  user: User
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const authUser = useUser()
  const deleteConfirm = useOpenState()

  const handleDelete = async () => {
    await deleteUser({ userId: user.uid })
    deleteConfirm.close()
  }

  return (
    <>
      <ConfirmDeleteDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setIsOpen}
        entityName="user"
        itemName={getUserName(user)}
        onDelete={handleDelete}
      />
      <RowDropdownMenu>
        <DropdownMenuItem asChild>
          <Link href={routes.users.user(user.uid)}>
            <Pencil />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={deleteConfirm.open}
          disabled={authUser.uid === user.uid}
        >
          <Trash />
          Delete
        </DropdownMenuItem>
      </RowDropdownMenu>
    </>
  )
}
