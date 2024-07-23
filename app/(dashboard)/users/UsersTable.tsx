//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { createColumnHelper } from '@tanstack/table-core'
import { Mail } from 'lucide-react'
import { stringifyRole } from '@/modules/firebase/role'
import { CopyText } from '@/packages/design-system/src/components/CopyText'
import { DataTable } from '@/packages/design-system/src/components/DataTable'
import { Tooltip } from '@/packages/design-system/src/components/Tooltip'
import type { User } from './page'
import { UserMenu } from './UserMenu'

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('uid', {
    header: 'Id',
    cell: (props) =>
      props.row.original.isInvitation ?
        <Tooltip tooltip="User hasn't logged in yet">
          <div className="flex items-center gap-2">
            <Mail className="size-5 text-muted-foreground" />
            Invitation
          </div>
        </Tooltip>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      : <CopyText className="max-w-[7rem]">{props.getValue()!}</CopyText>,
  }),
  columnHelper.accessor('displayName', {
    header: 'Name',
    cell: (props) => props.getValue() ?? '-',
  }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('role', {
    header: 'Role',
    cell: (props) => stringifyRole(props.getValue()),
  }),
  columnHelper.display({
    id: 'actions',
    cell: (props) => <UserMenu user={props.row.original} />,
  }),
]

interface UsersDataTableProps {
  data: User[]
}

export const UsersTable = ({ data }: UsersDataTableProps) => (
  <DataTable columns={columns} data={data} entityName="users" />
)
