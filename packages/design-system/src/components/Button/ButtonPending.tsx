//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { Loader2 } from 'lucide-react'
import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/className'

interface ButtonPendingProps extends HTMLAttributes<HTMLSpanElement> {
  isPending?: boolean
}

/**
 * Utility to compose button with pending state
 * It's separated from Button to prevent redundant markup when unnecessary
 * */
export const ButtonPending = forwardRef<HTMLSpanElement, ButtonPendingProps>(
  ({ children, isPending, className, ...props }, ref) => (
    <span className={cn('relative', className)} ref={ref} {...props}>
      {isPending && (
        <div
          className="absolute -top-0.5 left-1/2 -translate-x-1/2"
          aria-hidden
          data-testid="ButtonPending"
        >
          <Loader2 className="animate-spin" />
        </div>
      )}
      <span className={cn(isPending && 'invisible')}>{children}</span>
    </span>
  ),
)

ButtonPending.displayName = 'ButtonPending'
