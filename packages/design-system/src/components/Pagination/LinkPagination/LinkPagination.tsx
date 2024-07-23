import {
  PaginationItemType,
  usePagination,
  type UsePaginationProps,
} from '@nextui-org/use-pagination'
import Link from 'next/link'
import { type Url } from '../../../utils/misc'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationItemContainer,
  PaginationNext,
  PaginationNextIcon,
  PaginationPrevious,
  PaginationPreviousIcon,
} from '../Pagination'

export interface LinkPaginationProps extends UsePaginationProps {
  total: number
  /**
   * Currently selected page, 1-based
   * */
  page: number
  getHref: (page: number) => Url
}

/**
 * Complete link-based pagination
 * */
export const LinkPagination = ({
  total,
  page,
  getHref,
  showControls = true,
  ...props
}: LinkPaginationProps) => {
  const { activePage, range } = usePagination({
    total,
    page,
    showControls,
    ...props,
  })

  return (
    <Pagination>
      <PaginationContent>
        {range.map((rangePage, index) => {
          if (rangePage === PaginationItemType.PREV) {
            if (page === 1) return null
            return (
              <PaginationItemContainer key={rangePage}>
                <PaginationPrevious asChild>
                  <Link href={getHref(activePage - 1)}>
                    <PaginationPreviousIcon />
                  </Link>
                </PaginationPrevious>
              </PaginationItemContainer>
            )
          }
          if (rangePage === PaginationItemType.NEXT) {
            if (page === total) return null
            return (
              <PaginationItemContainer key={rangePage}>
                <PaginationNext asChild>
                  <Link href={getHref(activePage + 1)}>
                    <PaginationNextIcon />
                  </Link>
                </PaginationNext>
              </PaginationItemContainer>
            )
          }
          if (rangePage === PaginationItemType.DOTS)
            return (
              <PaginationItemContainer key={`${rangePage}-${index}`}>
                <PaginationEllipsis />
              </PaginationItemContainer>
            )
          return (
            <PaginationItemContainer key={rangePage}>
              <PaginationItem isActive={rangePage === page}>
                <Link href={getHref(rangePage)}>{rangePage}</Link>
              </PaginationItem>
            </PaginationItemContainer>
          )
        })}
      </PaginationContent>
    </Pagination>
  )
}
