import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react'
import { type ComponentProps, forwardRef } from 'react'
import { cn } from '../../utils/className'
import { Button, type ButtonProps } from '../Button'

export const Pagination = ({ className, ...props }: ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('flex justify-center', className)}
    {...props}
  />
)

export const PaginationContent = forwardRef<
  HTMLUListElement,
  ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

export const PaginationItemContainer = forwardRef<
  HTMLLIElement,
  ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))

PaginationItemContainer.displayName = 'PaginationItemContainer'

interface PaginationLinkProps extends ButtonProps {
  isActive?: boolean
}

export const PaginationItem = ({
  isActive,
  size = 'sm',
  ...props
}: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? 'page' : undefined}
    variant={isActive ? 'outline' : 'ghost'}
    size={size}
    {...props}
  />
)

export const PaginationPrevious = (
  props: ComponentProps<typeof PaginationItem>,
) => (
  <PaginationItem aria-label="Go to previous page" {...props}>
    <ChevronLeft className="size-4" />
  </PaginationItem>
)

export const PaginationNext = (
  props: ComponentProps<typeof PaginationItem>,
) => (
  <PaginationItem aria-label="Go to next page" {...props}>
    <ChevronRight className="size-4" />
  </PaginationItem>
)

export const PaginationEllipsis = ({
  className,
  ...props
}: ComponentProps<'span'>) => (
  <span aria-hidden className={cn('flex-center size-9', className)} {...props}>
    <Ellipsis className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
)
