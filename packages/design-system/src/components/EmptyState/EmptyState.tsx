import { SearchX, ListX } from 'lucide-react'
import { HTMLProps } from 'react'
import { cn } from '../../utils/className'

interface EmptyStateProps extends HTMLProps<HTMLDivElement> {
  entityName?: string
  textFilter?: string
}

export const EmptyState = ({
  entityName,
  textFilter,
  className,
  ...props
}: EmptyStateProps) => (
  <div
    className={cn('flex-center gap-3 text-muted-foreground', className)}
    {...props}
  >
    {textFilter ?
      <SearchX />
    : <ListX />}
    <span>
      No {entityName ?? 'results'} found
      {textFilter && (
        <>
          &nbsp;for <i>"{textFilter}"</i> search
        </>
      )}
      .
    </span>
  </div>
)
