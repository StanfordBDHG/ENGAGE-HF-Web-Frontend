//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { action } from '@storybook/addon-actions'
import { type Meta } from '@storybook/react'
import Link from 'next/link'
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
} from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
}

export default meta

/**
 * Renders buttons by default
 * */
export const Default = () => (
  <Pagination>
    <PaginationContent>
      <PaginationItemContainer>
        <PaginationPrevious onClick={action('previous click')} />
      </PaginationItemContainer>
      <PaginationItemContainer>
        <PaginationItem onClick={action('page click')}>1</PaginationItem>
      </PaginationItemContainer>
      <PaginationItemContainer>
        <PaginationItem onClick={action('page click')} isActive>
          2
        </PaginationItem>
      </PaginationItemContainer>
      <PaginationItemContainer>
        <PaginationItem onClick={action('page click')}>3</PaginationItem>
      </PaginationItemContainer>
      <PaginationItemContainer>
        <PaginationEllipsis />
      </PaginationItemContainer>
      <PaginationItemContainer>
        <PaginationNext onClick={action('next click')} />
      </PaginationItemContainer>
    </PaginationContent>
  </Pagination>
)

/**
 * Opt-in to using links
 * */
export const Links = () => (
  <Pagination>
    <PaginationContent>
      <PaginationItemContainer>
        <PaginationPrevious asChild>
          <Link href="/prev">
            <PaginationPreviousIcon />
          </Link>
        </PaginationPrevious>
      </PaginationItemContainer>
      <PaginationItemContainer>
        <PaginationItem asChild>
          <Link href="/1">1</Link>
        </PaginationItem>
      </PaginationItemContainer>
      <PaginationItemContainer>
        <PaginationItem asChild isActive>
          <Link href="/2">2</Link>
        </PaginationItem>
      </PaginationItemContainer>
      <PaginationItemContainer>
        <PaginationItem asChild>
          <Link href="/3">3</Link>
        </PaginationItem>
      </PaginationItemContainer>
      <PaginationItemContainer>
        <PaginationEllipsis />
      </PaginationItemContainer>
      <PaginationItemContainer>
        <PaginationNext asChild>
          <Link href="/next">
            <PaginationNextIcon />
          </Link>
        </PaginationNext>
      </PaginationItemContainer>
    </PaginationContent>
  </Pagination>
)
