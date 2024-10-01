//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { deleteDoc } from '@firebase/firestore'
import { useRouter } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/table-core'
import { Pencil, Plus, Trash } from 'lucide-react'
import { docRefs } from '@/modules/firebase/app'
import { Button } from '@/packages/design-system/src/components/Button'
import {
  DataTable,
  dateColumn,
  dateTimeColumn,
  RowDropdownMenu,
} from '@/packages/design-system/src/components/DataTable'
import { DropdownMenuItem } from '@/packages/design-system/src/components/DropdownMenu'
import { ConfirmDeleteDialog } from '@/packages/design-system/src/molecules/ConfirmDeleteDialog'
import {
  useOpenState,
  useStatefulOpenState,
} from '@/packages/design-system/src/utils/useOpenState'
import {
  createAppointment,
  updateAppointment,
} from '@/routes/~_dashboard/~patients/actions'
import type {
  AppointmentsData,
  Appointment,
} from '@/routes/~_dashboard/~patients/utils'
import {
  AppointmentFormDialog,
  type AppointmentFormSchema,
} from '@/routes/~_dashboard/~patients/~$id/AppointmentForm'

interface AppointmentsProps extends AppointmentsData {}

const columnHelper = createColumnHelper<Appointment>()

export const Appointments = ({
  appointments,
  userId,
  resourceType,
}: AppointmentsProps) => {
  const router = useRouter()
  const createDialog = useOpenState()
  const deleteDialog = useStatefulOpenState<Appointment>()
  const editDialog = useStatefulOpenState<Appointment>()

  const handleCreate = async (data: AppointmentFormSchema) => {
    await createAppointment({
      userId,
      resourceType,
      ...data,
    })
    createDialog.close()
    await router.invalidate()
  }

  const handleDelete = async () => {
    const appointment = deleteDialog.state
    if (!appointment) return
    await deleteDoc(
      docRefs.appointment({
        userId,
        resourceType,
        appointmentId: appointment.id,
      }),
    )
    await router.invalidate()
    deleteDialog.close()
  }

  const handleEdit = async (data: AppointmentFormSchema) => {
    const appointment = editDialog.state
    if (!appointment) return
    await updateAppointment({
      userId,
      resourceType,
      appointmentId: appointment.id,
      ...data,
    })
    await router.invalidate()
    editDialog.close()
  }

  return (
    <>
      <AppointmentFormDialog
        onSubmit={handleCreate}
        open={createDialog.isOpen}
        onOpenChange={createDialog.setIsOpen}
      />
      <AppointmentFormDialog
        onSubmit={handleEdit}
        open={editDialog.isOpen}
        onOpenChange={editDialog.close}
        appointment={editDialog.state}
      />
      <ConfirmDeleteDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.close}
        entityName="observation"
        onDelete={handleDelete}
      />
      <DataTable
        columns={[
          columnHelper.accessor('created', {
            header: 'Created',
            cell: dateColumn,
          }),
          columnHelper.accessor('providerName', {
            header: 'Provider name',
          }),
          columnHelper.accessor('start', {
            header: 'Start',
            cell: dateTimeColumn,
          }),
          columnHelper.display({
            id: 'actions',
            cell: (props) => {
              const appointment = props.row.original
              return (
                <RowDropdownMenu>
                  <DropdownMenuItem
                    onClick={() => editDialog.open(appointment)}
                  >
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteDialog.open(appointment)}
                  >
                    <Trash />
                    Delete
                  </DropdownMenuItem>
                </RowDropdownMenu>
              )
            },
          }),
        ]}
        data={appointments}
        entityName="appointments"
        header={
          <>
            <Button
              size="sm"
              variant="secondary"
              className="ml-auto"
              onClick={createDialog.open}
            >
              <Plus />
              Add appointment
            </Button>
          </>
        }
      />
    </>
  )
}
