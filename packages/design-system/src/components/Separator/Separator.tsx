//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from 'react'
import { cn } from '../../utils/className'

export const Separator = forwardRef<
  ElementRef<typeof SeparatorPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = 'horizontal', decorative, children, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative ?? !!children}
      orientation={orientation}
      className={cn(
        'relative shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h -full w-[1px]',
        className,
      )}
      {...props}
    >
      {children}
    </SeparatorPrimitive.Root>
  ),
)

Separator.displayName = SeparatorPrimitive.Root.displayName
