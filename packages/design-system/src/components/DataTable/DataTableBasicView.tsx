//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type Row } from '@tanstack/react-table'
import { Fragment, type ReactNode } from 'react'
import { EmptyState } from '@/packages/design-system/src/components/EmptyState'
import { ensureString } from '@/packages/design-system/src/utils/misc'
import type { DataTableViewProps } from './DataTable'

interface DataTableBasicViewProps<Data> extends DataTableViewProps<Data> {
  children: (data: Data, row: Row<Data>) => ReactNode
}

export const DataTableBasicView = <Data,>({
  table,
  entityName,
  children,
}: DataTableBasicViewProps<Data>) => {
  const rows = table.getRowModel().rows
  return (
    <div>
      {!rows.length ?
        <EmptyState
          entityName={entityName}
          textFilter={ensureString(table.getState().globalFilter)}
          hasFilters={table.getState().columnFilters.length > 0}
          className="h-24"
        />
      : rows.map((row) => (
          <Fragment key={row.id}>{children(row.original, row)}</Fragment>
        ))
      }
    </div>
  )
}
