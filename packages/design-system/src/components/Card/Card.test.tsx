//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Card } from '.'

describe('Button', () => {
  it('renders element with button role', () => {
    render(<Card />)

    const element = screen.getByRole('button')
    expect(element).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Card>Lorem</Card>)

    const element = screen.getByText('Lorem')
    expect(element).toBeInTheDocument()
  })

  it('supports asChild property to render other type of elements with button classes', () => {
    render(
      <Card asChild>
        <a href="http://example.com" />
      </Card>,
    )

    const button = screen.queryByRole('button')
    expect(button).not.toBeInTheDocument()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('class')
  })

  it('supports isPending', () => {
    const queryButtonPending = () => screen.queryByTestId('ButtonPending')
    const { rerender } = render(<Card isPending={false}>Lorem</Card>)

    expect(queryButtonPending()).not.toBeInTheDocument()

    rerender(<Card isPending>Lorem</Card>)

    expect(queryButtonPending()).toBeInTheDocument()
    const loadingButton = screen.getByRole('button')
    // Button should still render it's underlying content, but invisible
    // To maintain buttons width
    expect(loadingButton).toHaveTextContent('Lorem')
  })
})
