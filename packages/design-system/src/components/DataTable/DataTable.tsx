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
import { Table as TableType } from '@tanstack/table-core'

export type DataTableViewProps<Data> = { table: TableType<Data> } & Pick<
  DataTableProps<Data>,
  'entityName'
>

type ViewRenderProp<Data> = (props: DataTableViewProps<Data>) => ReactNode

export interface DataTableProps<Data> extends UseDataTableProps<Data> {
  className?: string
  /**
   * Name of the presented data entity
   * Used inside empty states, placeholders
   * Provide pluralized and lowercased
   * @example "users"
   * */
  entityName?: string
  header?: ReactNode | ViewRenderProp<Data>
  /**
   * Render props pattern to define different type of views than standard DataTableView
   * */
  children?: ViewRenderProp<Data>
}

export const DataTable = <Data,>({
  className,
  columns,
  entityName,
  data,
  pageSize,
  header,
  children,
  ...props
}: DataTableProps<Data>) => {
  const { table, setGlobalFilterDebounced } = useDataTable({
    data,
    columns,
    pageSize,
    ...props,
  })
  const rows = table.getRowModel().rows

  const viewProps = { table, entityName }

  return (
    <div className={cn('rounded-md border bg-surface-primary', className)}>
      <header className="flex items-center border-b p-4">
        <GlobalFilterInput
          onChange={(event) => setGlobalFilterDebounced(event.target.value)}
          entityName={entityName}
        />
        {typeof header === 'function' ? header(viewProps) : header}
      </header>
      {children ?
        children(viewProps)
      : <DataTableTableView table={table} entityName={entityName} />}
      {!!rows.length && (
        <footer className="flex items-center justify-between border-t p-4">
          <DataTablePagination table={table} />
        </footer>
      )}
    </div>
  )
}
