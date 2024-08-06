//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { SearchX, ListX } from 'lucide-react'
import { type HTMLProps } from 'react'
import { cn } from '../../utils/className'

export interface EmptyStateProps extends HTMLProps<HTMLDivElement> {
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
