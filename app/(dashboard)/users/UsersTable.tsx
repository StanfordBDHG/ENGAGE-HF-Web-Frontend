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
import { useMemo } from 'react'
import { Role, stringifyRole } from '@/modules/firebase/role'
import { useUser } from '@/modules/firebase/UserProvider'
import { CopyText } from '@/packages/design-system/src/components/CopyText'
import { DataTable } from '@/packages/design-system/src/components/DataTable'
import { Tooltip } from '@/packages/design-system/src/components/Tooltip'
import type { User } from './page'
import { UserMenu } from './UserMenu'

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('uid', {
    header: 'Id',
    cell: (props) => {
      const user = props.row.original
      return (
        user.resourceType === 'invitation' ?
          <Tooltip tooltip="User hasn't logged in yet">
            <div className="flex items-center gap-2">
              <Mail className="size-5 text-muted-foreground" />
              Invitation
            </div>
          </Tooltip>
        : user.uid ? <CopyText className="max-w-[7rem]">{user.uid}</CopyText>
        : '-'
      )
    },
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
  columnHelper.accessor('organization.name', {
    header: 'Organization',
  }),
  columnHelper.display({
    id: 'actions',
    cell: (props) => <UserMenu user={props.row.original} />,
  }),
]

interface UsersDataTableProps {
  data: User[]
}

export const UsersTable = ({ data }: UsersDataTableProps) => {
  const user = useUser()
  const visibleColumns = useMemo(
    () =>
      user.role === Role.admin ?
        columns
      : columns.filter((column) => column.id !== 'organization.name'),
    [user.role],
  )
  return <DataTable columns={visibleColumns} data={data} entityName="users" />
}
