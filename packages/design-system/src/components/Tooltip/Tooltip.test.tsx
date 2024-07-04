//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Tooltip } from '.'

describe('Tooltip', () => {
  it('renders accessible tooltip', () => {
    render(
      <Tooltip tooltip="Lorem">
        <button type="button" />
      </Tooltip>,
    )

    const tooltip = screen.queryByRole('tooltip')
    expect(tooltip).not.toBeInTheDocument()

    const trigger = screen.getByRole('button')
    fireEvent.mouseEnter(trigger)

    const tooltip2 = screen.getByRole('tooltip')
    expect(tooltip2).toBeInTheDocument()
    expect(trigger).toHaveAccessibleDescription('Lorem')
  })

  it('supports controlled state', () => {
    render(
      <Tooltip tooltip="Lorem" open={true}>
        <button type="button" />
      </Tooltip>,
    )

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
  })
})
