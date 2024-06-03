//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type Meta, type StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { X } from 'lucide-react'
import { Button, buttonVariants } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      options: Object.keys(buttonVariants.variant),
      control: { type: 'select' },
    },
    size: {
      options: Object.keys(buttonVariants.size),
      control: { type: 'select' },
    },
  },
  args: { onClick: fn(), children: 'Button' },
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = { args: { variant: 'default' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Outline: Story = { args: { variant: 'outline' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Link: Story = { args: { variant: 'link' } }

export const Sm: Story = { args: { size: 'sm' } }
export const Lg: Story = { args: { size: 'lg' } }

/**
 * Renders button styles over link element
 * */
export const AsChild: Story = {
  args: { asChild: true, children: <a href="#">Link</a> },
}

export const IsPending: Story = { args: { isPending: true } }

export const IconOnly: Story = { args: { children: <X /> } }
export const IconRight: Story = {
  args: {
    children: (
      <>
        Close
        <X />
      </>
    ),
  },
}
