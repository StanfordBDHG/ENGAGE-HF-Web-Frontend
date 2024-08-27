//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { createColumnHelper } from '@tanstack/table-core'
import { useMemo } from 'react'
import { useUser } from '@/modules/firebase/UserProvider'
import { UserType } from '@/modules/firebase/utils'
import { createSharedUserColumns, userColumnIds } from '@/modules/user/table'
import { DataTable } from '@/packages/design-system/src/components/DataTable'
import { PatientMenu } from '@/routes/~_dashboard/~patients/PatientMenu'
import { type Patient } from '@/routes/~_dashboard/~patients/~index'

const columnHelper = createColumnHelper<Patient>()
const userColumns = createSharedUserColumns<Patient>()
const columns = [
  userColumns.id,
  userColumns.displayName,
  userColumns.email,
  userColumns.organization,
  columnHelper.display({
    id: 'actions',
    cell: (props) => <PatientMenu patient={props.row.original} />,
  }),
]

interface PatientsDataTableProps {
  data: Patient[]
}

export const PatientsTable = ({ data }: PatientsDataTableProps) => {
  const user = useUser()
  const visibleColumns = useMemo(
    () =>
      user.user.type === UserType.admin ?
        columns
      : columns.filter((column) => column.id !== userColumnIds.organization),
    [user.user.type],
  )
  return (
    <DataTable columns={visibleColumns} data={data} entityName="patients" />
  )
}
