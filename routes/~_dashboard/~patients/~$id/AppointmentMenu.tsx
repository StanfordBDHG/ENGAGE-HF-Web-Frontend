//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { deleteDoc } from '@firebase/firestore'
import { useRouter } from '@tanstack/react-router'
import { Pencil, Trash } from 'lucide-react'
import { docRefs } from '@/modules/firebase/app'
import { type ResourceType } from '@/modules/firebase/utils'
import { RowDropdownMenu } from '@/packages/design-system/src/components/DataTable'
import { DropdownMenuItem } from '@/packages/design-system/src/components/DropdownMenu'
import { ConfirmDeleteDialog } from '@/packages/design-system/src/molecules/ConfirmDeleteDialog'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'
import { updateAppointment } from '@/routes/~_dashboard/~patients/actions'
import { type Appointment } from '@/routes/~_dashboard/~patients/utils'
import { AppointmentFormDialog } from '@/routes/~_dashboard/~patients/~$id/AppointmentForm'

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
  const router = useRouter()
  const deleteConfirm = useOpenState()
  const editAppointment = useOpenState()

  const handleDelete = async () => {
    await deleteDoc(
      docRefs.appointment({
        userId,
        resourceType,
        appointmentId: appointment.id,
      }),
    )
    await router.invalidate()
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
          await router.invalidate()
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
