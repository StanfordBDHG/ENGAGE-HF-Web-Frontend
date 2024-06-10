//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { forwardRef, type HTMLProps, type ReactNode } from 'react'
import { cn } from '../../utils/className'

interface ErrorProps extends HTMLProps<HTMLParagraphElement> {
  checkEmpty?: boolean
  children?: ReactNode
  className?: string
  id?: string
}

export const Error = forwardRef<HTMLParagraphElement, ErrorProps>(
  ({ children, className, checkEmpty = false, ...props }, ref) => {
    if (checkEmpty && !children) return null
    return (
      <p
        className={cn(
          'mt-2 min-h-[20px] text-[13px] leading-none text-destructive',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    )
  },
)

Error.displayName = 'Error'
