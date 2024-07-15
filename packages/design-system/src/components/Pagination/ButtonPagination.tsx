import { PaginationItemType, usePagination } from '@nextui-org/use-pagination'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationItemContainer,
  PaginationNext,
  PaginationPrevious,
} from './Pagination'

export interface PaginationProps {
  total: number
  page: number
  onPageChange: (page: number) => void
}

/**
 * Complete state-controlled pagination
 * */
export const ButtonPagination = ({
  total,
  page,
  onPageChange,
}: PaginationProps) => {
  const { activePage, range } = usePagination({
    total,
    page,
    showControls: true,
  })

  return (
    <Pagination>
      <PaginationContent>
        {range.map((rangePage, index) => {
          if (rangePage === PaginationItemType.PREV) {
            if (page === 1) return null
            return (
              <PaginationItemContainer key={rangePage}>
                <PaginationPrevious
                  onClick={() => onPageChange(activePage - 1)}
                />
              </PaginationItemContainer>
            )
          }
          if (rangePage === PaginationItemType.NEXT) {
            if (page === total) return null
            return (
              <PaginationItemContainer key={rangePage}>
                <PaginationNext onClick={() => onPageChange(activePage + 1)} />
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
              <PaginationItem
                onClick={() => onPageChange(rangePage)}
                isActive={rangePage === page}
              >
                {rangePage}
              </PaginationItem>
            </PaginationItemContainer>
          )
        })}
      </PaginationContent>
    </Pagination>
  )
}
