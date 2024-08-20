//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { createColumnHelper } from '@tanstack/table-core'
import { Plus } from 'lucide-react'
import { useMemo } from 'react'
import { AppointmentFormDialog } from '@/app/(dashboard)/patients/[id]/AppointmentForm'
import { AppointmentMenu } from '@/app/(dashboard)/patients/[id]/AppointmentMenu'
import { createAppointment } from '@/app/(dashboard)/patients/actions'
import type {
  AppointmentsData,
  Appointment,
} from '@/app/(dashboard)/patients/utils'
import { stringifyAppointmentStatus } from '@/modules/firebase/models/medication'
import { Button } from '@/packages/design-system/src/components/Button'
import {
  DataTable,
  dateColumn,
  dateTimeColumn,
} from '@/packages/design-system/src/components/DataTable'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'

interface AppointmentsProps extends AppointmentsData {}

const columnHelper = createColumnHelper<Appointment>()

export const Appointments = ({
  appointments,
  userId,
  resourceType,
}: AppointmentsProps) => {
  const createDialog = useOpenState()

  const columns = useMemo(
    () => [
      columnHelper.accessor('created', {
        header: 'Created',
        cell: dateColumn,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (props) => stringifyAppointmentStatus(props.getValue()),
      }),
      columnHelper.accessor('start', {
        header: 'Start',
        cell: dateTimeColumn,
      }),
      columnHelper.accessor('end', {
        header: 'End',
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
