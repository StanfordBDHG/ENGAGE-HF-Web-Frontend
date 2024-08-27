//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { useRouter } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/table-core'
import { Plus } from 'lucide-react'
import { useMemo } from 'react'
import { Button } from '@/packages/design-system/src/components/Button'
import {
  DataTable,
  dateColumn,
  dateTimeColumn,
} from '@/packages/design-system/src/components/DataTable'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'
import { createAppointment } from '@/routes/~_dashboard/~patients/actions'
import type {
  AppointmentsData,
  Appointment,
} from '@/routes/~_dashboard/~patients/utils'
import { AppointmentFormDialog } from '@/routes/~_dashboard/~patients/~$id/AppointmentForm'
import { AppointmentMenu } from '@/routes/~_dashboard/~patients/~$id/AppointmentMenu'

interface AppointmentsProps extends AppointmentsData {}

const columnHelper = createColumnHelper<Appointment>()

export const Appointments = ({
  appointments,
  userId,
  resourceType,
}: AppointmentsProps) => {
  const router = useRouter()
  const createDialog = useOpenState()

  const columns = useMemo(
    () => [
      columnHelper.accessor('created', {
        header: 'Created',
        cell: dateColumn,
      }),
      columnHelper.accessor('providerName', {
        header: 'Provider name',
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor('start', {
        header: 'Start',
        cell: dateTimeColumn,
      }),
      columnHelper.display({
        id: 'actions',
        cell: (props) => (
          <AppointmentMenu
            appointment={props.row.original}
            userId={userId}
            resourceType={resourceType}
          />
        ),
      }),
    ],
    [resourceType, userId],
  )

  return (
    <>
      <AppointmentFormDialog
        onSubmit={async (data) => {
          await createAppointment({
            userId,
            resourceType,
            ...data,
          })
          createDialog.close()
          await router.invalidate()
        }}
        open={createDialog.isOpen}
        onOpenChange={createDialog.setIsOpen}
      />
      <DataTable
        columns={columns}
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
