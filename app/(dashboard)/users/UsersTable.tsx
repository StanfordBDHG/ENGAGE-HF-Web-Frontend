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
import { CopyText } from '@/packages/design-system/src/components/CopyText'
import {
  DataTable,
  RowDropdownMenu,
} from '@/packages/design-system/src/components/DataTable'
import { DropdownMenuItem } from '@/packages/design-system/src/components/DropdownMenu'
import type { listUsers } from './page'

type User = Awaited<ReturnType<typeof listUsers>>[number]

const columnHelper = createColumnHelper<User>()

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
  columnHelper.accessor('role', { header: 'Role' }),
  columnHelper.display({
    id: 'actions',
    cell: () => (
      //   TODO: Actions
      <RowDropdownMenu>
        <DropdownMenuItem>
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash />
          Delete
        </DropdownMenuItem>
      </RowDropdownMenu>
    ),
  }),
]

interface UsersDataTableProps {
  data: User[]
}

export const UsersTable = ({ data }: UsersDataTableProps) => (
  <DataTable columns={columns} data={data} entityName="users" />
)
