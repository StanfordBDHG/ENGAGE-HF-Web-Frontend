//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { createColumnHelper } from '@tanstack/table-core'
import { useMemo } from 'react'
import { stringifyType } from '@/modules/firebase/role'
import { useUser } from '@/modules/firebase/UserProvider'
import { UserType } from '@/modules/firebase/utils'
import { createSharedUserColumns } from '@/modules/user/table'
import { DataTable } from '@/packages/design-system/src/components/DataTable'
import type { User } from './page'
import { UserMenu } from './UserMenu'

const columnHelper = createColumnHelper<User>()
const columnIds = {
  organization: 'organization',
}
const userColumns = createSharedUserColumns<User>()
const columns = [
  userColumns.id,
  userColumns.displayName,
  userColumns.email,
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (props) => {
      const value = props.getValue()
      return value ? stringifyType(value) : '-'
    },
  }),
  columnHelper.accessor('organization.name', {
    id: columnIds.organization,
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
      user.user.type === UserType.admin ?
        columns
      : columns.filter((column) => column.id !== columnIds.organization),
    [user.user.type],
  )
  return <DataTable columns={visibleColumns} data={data} entityName="users" />
}
