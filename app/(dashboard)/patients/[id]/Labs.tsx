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
import { LabFormDialog } from '@/app/(dashboard)/patients/[id]/LabForm'
import { LabMenu } from '@/app/(dashboard)/patients/[id]/LabMenu'
import { createObservation } from '@/app/(dashboard)/patients/actions'
import type { LabsData, Observation } from '@/app/(dashboard)/patients/utils'
import { Button } from '@/packages/design-system/src/components/Button'
import { DataTable } from '@/packages/design-system/src/components/DataTable'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'

interface LabsProps extends LabsData {}

const columnHelper = createColumnHelper<Observation>()

export const Labs = ({ observations, userId, resourceType }: LabsProps) => {
  const createDialog = useOpenState()

  const columns = useMemo(
    () => [
      columnHelper.accessor('effectiveDateTime', {
        header: 'Date',
        cell: (props) => {
          const value = props.getValue()
          const date = value ? new Date(value) : undefined
          return date?.toLocaleDateString() ?? ''
        },
      }),
      columnHelper.accessor('type', {
        header: 'Type',
      }),
      columnHelper.accessor('value', {
        header: 'Value',
        cell: (props) => {
          const observation = props.row.original
          return `${observation.value} ${observation.unit}`
        },
      }),
      columnHelper.display({
        id: 'actions',
        cell: (props) => (
          <LabMenu
            observation={props.row.original}
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
      <LabFormDialog
        onSubmit={async (data) => {
          await createObservation({
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
        data={observations}
        header={
          <>
            <Button
              size="sm"
              variant="secondary"
              className="ml-auto"
              onClick={createDialog.open}
            >
              <Plus />
              Add observation
            </Button>
          </>
        }
      />
    </>
  )
}
