//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { ButtonPending } from './ButtonPending'

export const buttonVariants = {
  variant: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    outline:
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  size: {
    default: 'h-10 px-4 py-2 rounded-md gap-2',
    sm: 'h-9 rounded-md px-3 gap-1',
    lg: 'h-11 rounded-md px-8 gap-2.5',
  },
}

export const buttonVariance = cva(
  'inline-flex items-center justify-center whitespace-nowrap transition-colors focus-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: buttonVariants,
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariance> {
  asChild?: boolean
  isPending?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild,
      type = 'button',
      isPending,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={buttonVariance({ variant, size, className })}
        ref={ref}
        type={type}
        aria-label={isPending ? 'Loading' : undefined}
        {...props}
      >
        {isPending !== undefined ?
          <ButtonPending isPending={isPending}>{children}</ButtonPending>
        : children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'
