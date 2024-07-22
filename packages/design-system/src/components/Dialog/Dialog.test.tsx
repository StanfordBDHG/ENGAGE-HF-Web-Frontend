//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '.'

describe('Dialog', () => {
  it('renders accessible dialog', () => {
    render(
      <Dialog>
        <DialogTrigger>Trigger</DialogTrigger>
        <DialogContent>
          <DialogTitle>Content</DialogTitle>
        </DialogContent>
      </Dialog>,
    )

    const getContent = () => screen.queryByText('Content')

    expect(getContent()).not.toBeInTheDocument()

    const trigger = screen.getByRole('button', { name: 'Trigger' })
    fireEvent.click(trigger)

    expect(getContent()).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    expect(getContent()).not.toBeInTheDocument()
  })
})
