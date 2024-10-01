import { flexRender } from '@tanstack/react-table'
import { type MouseEvent } from 'react'
import { ToggleSortButton } from '@/packages/design-system/src/components/DataTable/ToggleSortButton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/packages/design-system/src/components/Table'
import { TableEmptyState } from '@/packages/design-system/src/components/Table/TableEmptyState'
import { ensureString } from '@/packages/design-system/src/utils/misc'
import type { DataTableViewProps } from './DataTable'

export interface DataTableTableViewSpecificProps<Data> {
  onRowClick?: (data: Data, event: MouseEvent) => void
}

interface DataTableTableViewProps<Data>
  extends DataTableViewProps<Data>,
    DataTableTableViewSpecificProps<Data> {}

export const DataTableTableView = <Data,>({
  table,
  entityName,
  onRowClick,
}: DataTableTableViewProps<Data>) => {
  const rows = table.getRowModel().rows
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} isHoverable={false}>
            {headerGroup.headers.map((header) => {
              const columnContent =
                header.isPlaceholder ? null : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )
                )
              return (
                <TableHead key={header.id}>
                  {header.column.getCanFilter() ?
                    <ToggleSortButton header={header}>
                      {columnContent}
                    </ToggleSortButton>
                  : columnContent}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {!rows.length ?
          <TableEmptyState
            entityName={entityName}
            colSpan={table.getAllColumns().length}
            textFilter={ensureString(table.getState().globalFilter)}
            hasFilters={table.getState().columnFilters.length > 0}
          />
        : rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              onClick={
                onRowClick ?
                  (event) => onRowClick(row.original, event)
                : undefined
              }
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}
