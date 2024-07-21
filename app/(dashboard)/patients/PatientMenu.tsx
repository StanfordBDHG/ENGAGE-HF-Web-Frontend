'use client'
import { Pencil, Trash } from 'lucide-react'
import { deletePatient } from '@/app/(dashboard)/patients/actions'
import type { Patient } from '@/app/(dashboard)/patients/page'
import { RowDropdownMenu } from '@/packages/design-system/src/components/DataTable'
import { DropdownMenuItem } from '@/packages/design-system/src/components/DropdownMenu'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'
import { ConfirmDeleteDialog } from '@/packages/design-system/src/molecules/ConfirmDeleteDialog'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'

interface PatientMenuProps {
  patient: Patient
}

export const PatientMenu = ({ patient }: PatientMenuProps) => {
  const deleteConfirm = useOpenState()

  const handleDelete = async () => {
    await deletePatient({ userId: patient.uid })
    deleteConfirm.close()
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
        <DropdownMenuItem>
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteConfirm.open}>
          <Trash />
          Delete
        </DropdownMenuItem>
      </RowDropdownMenu>
    </>
  )
}
