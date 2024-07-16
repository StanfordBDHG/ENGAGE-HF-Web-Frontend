//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { copyToClipboard } from '../../utils/misc'
import { CopyText } from '.'

jest.mock('../../utils/misc')

describe('CopyText', () => {
  const clickCopy = () => {
    const button = screen.getByRole('button')
    fireEvent.click(button)
  }

  it('copies children value if string provided', async () => {
    render(<CopyText>John Doe</CopyText>)

    clickCopy()

    await waitFor(() => {
      expect(copyToClipboard).toHaveBeenLastCalledWith('John Doe')
    })
  })

  it('copies custom value', async () => {
    render(<CopyText value="special">John Doe</CopyText>)

    clickCopy()

    await waitFor(() => {
      expect(copyToClipboard).toHaveBeenLastCalledWith('special')
    })
  })
})
