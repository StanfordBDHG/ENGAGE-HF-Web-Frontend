import { Row } from '@tanstack/react-table'
import type { DataTableViewProps } from './DataTable'
import { EmptyState } from '@/packages/design-system/src/components/EmptyState'
import { Fragment, ReactNode } from 'react'

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
          textFilter={table.getState().globalFilter}
          hasFilters={table.getState().columnFilters.length > 0}
          className="py-6"
        />
      : rows.map((row) => (
          <Fragment key={row.id}>{children(row.original, row)}</Fragment>
        ))
      }
    </div>
  )
}
