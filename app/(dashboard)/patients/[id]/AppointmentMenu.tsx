//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { Pencil, Trash } from 'lucide-react'
import { AppointmentFormDialog } from '@/app/(dashboard)/patients/[id]/AppointmentForm'
import {
  deleteAppointment,
  updateAppointment,
} from '@/app/(dashboard)/patients/actions'
import { type Appointment } from '@/app/(dashboard)/patients/utils'
import { type ResourceType } from '@/modules/firebase/utils'
import { RowDropdownMenu } from '@/packages/design-system/src/components/DataTable'
import { DropdownMenuItem } from '@/packages/design-system/src/components/DropdownMenu'
import { ConfirmDeleteDialog } from '@/packages/design-system/src/molecules/ConfirmDeleteDialog'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'

interface AppointmentMenuProps {
  userId: string
  resourceType: ResourceType
  appointment: Appointment
}

export const AppointmentMenu = ({
  userId,
  resourceType,
  appointment,
}: AppointmentMenuProps) => {
  const deleteConfirm = useOpenState()
  const editAppointment = useOpenState()

  const handleDelete = async () => {
    await deleteAppointment({
      userId,
      resourceType,
      appointmentId: appointment.id,
    })
    deleteConfirm.close()
  }

  return (
    <>
      <AppointmentFormDialog
        onSubmit={async (data) => {
          await updateAppointment({
            userId,
            resourceType,
            appointmentId: appointment.id,
            ...data,
          })
          editAppointment.close()
        }}
        open={editAppointment.isOpen}
        onOpenChange={editAppointment.setIsOpen}
        appointment={appointment}
      />
      <ConfirmDeleteDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setIsOpen}
        entityName="observation"
        onDelete={handleDelete}
      />
      <RowDropdownMenu>
        <DropdownMenuItem onClick={editAppointment.open}>
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
