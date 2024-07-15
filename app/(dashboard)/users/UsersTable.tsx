//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { createColumnHelper } from '@tanstack/table-core'
import { Pencil, Trash } from 'lucide-react'
import {
  DataTable,
  RowDropdownMenu,
} from '@/packages/design-system/src/components/DataTable'
import { DropdownMenuItem } from '@/packages/design-system/src/components/DropdownMenu'
import type { listUsers } from './page'

type User = Awaited<ReturnType<typeof listUsers>>[number]

interface UsersDataTableProps {
  data: User[]
}

const columnHelper = createColumnHelper<User>()

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
  columnHelper.accessor('role', { header: 'Role' }),
  columnHelper.display({
    id: 'actions',
    cell: () => (
      //   TODO: Actions
      <RowDropdownMenu>
        <DropdownMenuItem>
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash className="size-4" />
          Delete
        </DropdownMenuItem>
      </RowDropdownMenu>
    ),
  }),
]

export const UsersTable = ({ data }: UsersDataTableProps) => (
  <DataTable columns={columns} data={data} />
)
