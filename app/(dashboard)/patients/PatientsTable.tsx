//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { createColumnHelper } from '@tanstack/table-core'
import { Ellipsis, Trash, Pencil } from 'lucide-react'
import { Button } from '@/packages/design-system/src/components/Button'
import { DataTable } from '@/packages/design-system/src/components/DataTable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/packages/design-system/src/components/DropdownMenu'
import type { listPatients } from './page'

type Patient = Awaited<ReturnType<typeof listPatients>>[number]

interface PatientsDataTableProps {
  data: Patient[]
}

const columnHelper = createColumnHelper<Patient>()

const columns = [
  columnHelper.accessor('uid', {
    header: 'Id',
    cell: (props) => (
      //   TODO: Truncate with Tooltip
      <div className="max-w-[50px] truncate">{props.getValue()}</div>
    ),
  }),
  columnHelper.accessor('displayName', {
    header: 'Name',
    cell: (props) => props.getValue() ?? '-',
  }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.display({
    id: 'actions',
    cell: () => (
      //   TODO: Actions
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="round" className="size-6 text-right" variant="ghost">
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
]

export const PatientsTable = ({ data }: PatientsDataTableProps) => (
  <DataTable columns={columns} data={data} />
)
