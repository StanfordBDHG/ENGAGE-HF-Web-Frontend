//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { deleteDoc } from '@firebase/firestore'
import { Link, useRouter } from '@tanstack/react-router'
import { Pencil, Trash } from 'lucide-react'
import { callables, docRefs } from '@/modules/firebase/app'
import { routes } from '@/modules/routes'
import { RowDropdownMenu } from '@/packages/design-system/src/components/DataTable'
import { DropdownMenuItem } from '@/packages/design-system/src/components/DropdownMenu'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'
import { ConfirmDeleteDialog } from '@/packages/design-system/src/molecules/ConfirmDeleteDialog'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'
import { type Patient } from '@/routes/~_dashboard/~patients/~index'

interface PatientMenuProps {
  patient: Patient
}

export const PatientMenu = ({ patient }: PatientMenuProps) => {
  const router = useRouter()
  const deleteConfirm = useOpenState()

  const handleDelete = async () => {
    if (patient.resourceType === 'user') {
      await callables.deleteUser({ userId: patient.resourceId })
    } else {
      await deleteDoc(docRefs.invitation(patient.resourceId))
    }
    deleteConfirm.close()
    await router.invalidate()
  }

  return (
    <>
      <ConfirmDeleteDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setIsOpen}
        entityName="patient"
        itemName={getUserName(patient)}
        onDelete={handleDelete}
      />
      <RowDropdownMenu>
        <DropdownMenuItem asChild>
          <Link
            to={routes.patients.patient(
              patient.resourceId,
              patient.resourceType,
            )}
          >
            <Pencil />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteConfirm.open}>
          <Trash />
          Delete
        </DropdownMenuItem>
      </RowDropdownMenu>
    </>
  )
}
