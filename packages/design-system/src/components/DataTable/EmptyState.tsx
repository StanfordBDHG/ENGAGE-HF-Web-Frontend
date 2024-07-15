import { SearchX, ListX } from 'lucide-react'
import type { DataTableProps } from './DataTable'
import { TableCell, TableRow } from '../Table'

interface EmptyStateProps extends Pick<DataTableProps<unknown>, 'entityName'> {
  globalFilter?: string
  hasData: boolean
  colSpan: number
}

export const EmptyState = ({
  entityName,
  hasData,
  colSpan,
  globalFilter,
}: EmptyStateProps) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="h-24 text-center">
      <div className="flex-center gap-3 text-muted-foreground">
        {hasData ?
          <SearchX />
        : <ListX />}
        <span>
          No {entityName ?? 'results'} found
          {hasData && (
            <>
              &nbsp;for <i>"{globalFilter}"</i> search
            </>
          )}
          .
        </span>
      </div>
    </TableCell>
  </TableRow>
)
