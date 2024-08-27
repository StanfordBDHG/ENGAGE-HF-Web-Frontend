//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'

export const cardVariants = {}

export const cardVariance = cva(
  'rounded-md border bg-card text-card-foreground shadow-sm',
  { variants: cardVariants },
)

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariance> {
  asChild?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'
    return <Comp className={cardVariance({ className })} ref={ref} {...props} />
  },
)
Card.displayName = 'Button'
