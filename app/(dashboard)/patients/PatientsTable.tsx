//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { createColumnHelper } from '@tanstack/table-core'
import { CopyText } from '@/packages/design-system/src/components/CopyText'
import { DataTable } from '@/packages/design-system/src/components/DataTable'
import type { Patient } from './page'
import { PatientMenu } from './PatientMenu'

const columnHelper = createColumnHelper<Patient>()

const columns = [
  columnHelper.accessor('uid', {
    header: 'Id',
    cell: (props) => (
      <CopyText className="max-w-[7rem]">{props.getValue()}</CopyText>
    ),
  }),
  columnHelper.accessor('displayName', {
    header: 'Name',
    cell: (props) => props.getValue() ?? '-',
  }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('gender', { header: 'Gender' }),
  columnHelper.display({
    id: 'actions',
    cell: (props) => <PatientMenu patient={props.row.original} />,
  }),
]

interface PatientsDataTableProps {
  data: Patient[]
}

export const PatientsTable = ({ data }: PatientsDataTableProps) => (
  <DataTable columns={columns} data={data} entityName="patients" />
)
