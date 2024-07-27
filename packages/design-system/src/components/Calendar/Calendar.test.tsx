//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Calendar } from '.'

describe('Calendar', () => {
  it('renders calendar', () => {
    const date = new Date(2024, 6, 27)
    const onSelect = jest.fn()
    render(<Calendar mode="single" selected={date} onSelect={onSelect} />)

    const goToPrevMonth = screen.getByRole('button', {
      name: 'Go to previous month',
    })
    expect(goToPrevMonth).toBeInTheDocument()
    const goTo24th = screen.getByRole('gridcell', {
      name: '24',
    })
    expect(goTo24th).toBeInTheDocument()
  })
})
