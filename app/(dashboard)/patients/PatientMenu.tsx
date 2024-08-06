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
import {
  deletePatient,
  deleteInvitation,
} from '@/app/(dashboard)/patients/actions'
import type { Patient } from '@/app/(dashboard)/patients/page'
import { routes } from '@/modules/routes'
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
    if (patient.resourceType === 'user') {
      await deletePatient({ userId: patient.resourceId })
    } else {
      await deleteInvitation({ invitationId: patient.resourceId })
    }
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
        <DropdownMenuItem asChild>
          <Link href={routes.patients.patient(patient.resourceId)}>
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
