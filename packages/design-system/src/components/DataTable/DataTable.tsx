//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type ReactNode } from 'react'
import { useDataTable, UseDataTableProps } from './DataTable.utils'
import { GlobalFilterInput } from './GlobalFilterInput'
import { cn } from '../../utils/className'
import { DataTablePagination } from './DataTablePagination'
import { DataTableTableView } from '@/packages/design-system/src/components/DataTable/DataTableTableView'

export interface DataTableProps<Data> extends UseDataTableProps<Data> {
  className?: string
  /**
   * Name of the presented data entity
   * Used inside empty states, placeholders
   * Provide pluralized and lowercased
   * @example "users"
   * */
  entityName?: string
  header?: ReactNode
}

export const DataTable = <Data,>({
  className,
  columns,
  entityName,
  data,
  pageSize,
  header,
  ...props
}: DataTableProps<Data>) => {
  const { table, setGlobalFilterDebounced } = useDataTable({
    data,
    columns,
    pageSize,
    ...props,
  })
  const rows = table.getRowModel().rows

  return (
    <div className={cn('rounded-md border bg-surface-primary', className)}>
      <header className="flex items-center border-b p-4">
        <GlobalFilterInput
          onChange={(event) => setGlobalFilterDebounced(event.target.value)}
          entityName={entityName}
        />
        {header}
      </header>
      <DataTableTableView table={table} entityName={entityName} />
      {!!rows.length && (
        <footer className="flex items-center justify-between border-t p-4">
          <DataTablePagination table={table} />
        </footer>
      )}
    </div>
  )
}
