//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { type Auth, type AuthProvider, signInWithPopup } from 'firebase/auth'
import { SignInForm } from './SignInForm'
import { Providers } from '../../../tests/Providers'

const authMock = {} as Auth
const mockProvider = {} as AuthProvider
const mockProviders = [{ name: 'Lorem', provider: mockProvider }]

jest.mock('firebase/auth')

describe('SignInForm', () => {
  it('renders SSO providers and calls signInWithPopup', () => {
    render(
      <SignInForm
        enableEmailPassword={false}
        providers={mockProviders}
        auth={authMock}
      />,
      { wrapper: Providers },
    )

    const ssoButton = screen.getByRole('button', { name: 'Sign in with Lorem' })
    fireEvent.click(ssoButton)

    expect(signInWithPopup).toHaveBeenCalled()
  })

  it('renders email password form', () => {
    render(
      <SignInForm enableEmailPassword={true} providers={[]} auth={authMock} />,
      { wrapper: Providers },
    )

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('renders separator only if has providers and email password', () => {
    const { rerender } = render(
      <SignInForm enableEmailPassword={true} providers={[]} auth={authMock} />,
      { wrapper: Providers },
    )

    expect(screen.queryByText('or')).not.toBeInTheDocument()

    rerender(
      <SignInForm
        enableEmailPassword={true}
        providers={mockProviders}
        auth={authMock}
      />,
    )

    expect(screen.queryByText('or')).toBeInTheDocument()
  })
})
