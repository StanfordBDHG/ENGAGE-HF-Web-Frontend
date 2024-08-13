//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { createColumnHelper } from '@tanstack/table-core'
import { type LabsData } from '@/app/(dashboard)/patients/utils'
import { DataTable } from '@/packages/design-system/src/components/DataTable'

interface LabsProps extends LabsData {}

type Observation = LabsData['observations'][number]

const columnHelper = createColumnHelper<Observation>()
const columns = [
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
]

export const Labs = ({ observations }: LabsProps) => {
  return <DataTable columns={columns} data={observations} />
}
