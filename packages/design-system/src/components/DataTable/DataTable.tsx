//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { type TableOptions } from '@tanstack/table-core'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { fuzzyFilter } from './DataTable.utils'
import { GlobalFilterInput } from './GlobalFilterInput'
import { ToggleSortButton } from './ToggleSortButton'
import { cn } from '../../utils/className'
import { type PartialSome } from '../../utils/misc'
import { ButtonPagination } from '../Pagination/ButtonPagination'
import { RangeCounter } from '../RangeCounter'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../Table'
import { TableEmptyState } from '../Table/TableEmptyState'

export interface DataTableProps<Data>
  extends PartialSome<TableOptions<Data>, 'getCoreRowModel' | 'filterFns'> {
  className?: string
  /**
   * Name of the presented data entity
   * Used inside empty states, placeholders
   * Provide pluralized and lowercased
   * @example "users"
   * */
  entityName?: string
  pageSize?: number
}

export const DataTable = <Data,>({
  className,
  columns,
  entityName,
  data,
  pageSize = 50,
  ...props
}: DataTableProps<Data>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const setGlobalFilterDebounced = useDebouncedCallback(
    (value: string) => setGlobalFilter(value),
    200,
  )

  const table = useReactTable({
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    state: { globalFilter, sorting },
    initialState: {
      pagination: {
        pageSize,
      },
    },
    ...props,
  })
  const rows = table.getRowModel().rows
  const filteredRowsLength = table.getFilteredRowModel().rows.length

  const tableState = table.getState()
  const currentPage = tableState.pagination.pageIndex + 1

  const itemsRangeStartIndex = tableState.pagination.pageIndex * pageSize

  const pageCount = table.getPageCount()
  return (
    <div className={cn('rounded-md border bg-surface-primary', className)}>
      <header className="flex border-b p-4">
        <GlobalFilterInput
          onChange={(event) => setGlobalFilterDebounced(event.target.value)}
          entityName={entityName}
        />
      </header>
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
              colSpan={columns.length}
              textFilter={globalFilter}
            />
          : rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
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
      {!!rows.length && (
        <footer className="flex items-center justify-between border-t p-4">
          <RangeCounter
            start={itemsRangeStartIndex + 1}
            end={itemsRangeStartIndex + rows.length}
            all={filteredRowsLength}
          />
          {pageCount > 1 && (
            <ButtonPagination
              total={pageCount}
              page={currentPage}
              onPageChange={(page) => table.setPageIndex(page - 1)}
            />
          )}
        </footer>
      )}
    </div>
  )
}
