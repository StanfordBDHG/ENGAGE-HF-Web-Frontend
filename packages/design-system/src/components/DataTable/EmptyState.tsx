//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import type { DataTableProps } from './DataTable'
import { EmptyState as EmptyStateBase } from '../EmptyState'
import { TableCell, TableRow } from '../Table'

interface EmptyStateProps extends Pick<DataTableProps<unknown>, 'entityName'> {
  globalFilter?: string
  colSpan: number
}

export const EmptyState = ({
  entityName,
  colSpan,
  globalFilter,
}: EmptyStateProps) => (
  <TableRow isHoverable={false}>
    <TableCell colSpan={colSpan} className="h-24 text-center">
      <EmptyStateBase textFilter={globalFilter} entityName={entityName} />
    </TableCell>
  </TableRow>
)
