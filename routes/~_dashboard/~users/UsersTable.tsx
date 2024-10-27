//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { UserType } from '@stanfordbdhg/engagehf-models'
import { DataTable } from '@stanfordbdhg/spezi-web-design-system/components/DataTable'
import { useNavigate } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/table-core'
import { useMemo } from 'react'
import { stringifyType } from '@/modules/firebase/role'
import { useUser } from '@/modules/firebase/UserProvider'
import { routes } from '@/modules/routes'
import { createSharedUserColumns, userColumnIds } from '@/modules/user/table'
import { UserMenu } from '@/routes/~_dashboard/~users/UserMenu'
import { type User } from '@/routes/~_dashboard/~users/~index'

const columnHelper = createColumnHelper<User>()
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
  userColumns.organization,
  columnHelper.display({
    id: 'actions',
    cell: (props) => <UserMenu user={props.row.original} />,
  }),
]

interface UsersDataTableProps {
  data: User[]
}

export const UsersTable = ({ data }: UsersDataTableProps) => {
  const navigate = useNavigate()
  const user = useUser()
  const visibleColumns = useMemo(
    () =>
      user.user.type === UserType.admin ?
        columns
      : columns.filter((column) => column.id !== userColumnIds.organization),
    [user.user.type],
  )
  return (
    <DataTable
      columns={visibleColumns}
      data={data}
      entityName="users"
      tableView={{
        onRowClick: (user) =>
          void navigate({
            to: routes.users.user(user.resourceId),
          }),
      }}
    />
  )
}
