//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { type Auth, type AuthProvider } from 'firebase/auth'
import { SignInForm } from './SignInForm'
import { Providers } from '../../../tests/Providers'

const authMock = {} as Auth
const providerMock = {} as AuthProvider
const providersMock = [{ name: 'Lorem', provider: providerMock }]
const signInWithPopupMock = jest.fn()
const signInWithEmailAndPasswordMock = jest.fn()

const defaultProps = {
  enableEmailPassword: false,
  providers: providersMock,
  auth: authMock,
  signInWithEmailAndPassword: signInWithEmailAndPasswordMock,
  signInWithPopup: signInWithPopupMock,
}

jest.mock('firebase/auth')

describe('SignInForm', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('renders SSO providers and calls signInWithPopup', () => {
    render(<SignInForm {...defaultProps} />, { wrapper: Providers })

    const ssoButton = screen.getByRole('button', { name: 'Sign in with Lorem' })
    fireEvent.click(ssoButton)

    expect(signInWithPopupMock).toHaveBeenCalled()
  })

  it('renders email password form', () => {
    render(
      <SignInForm
        {...defaultProps}
        enableEmailPassword={true}
        providers={[]}
      />,
      { wrapper: Providers },
    )

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('renders separator only if has providers and email password', () => {
    const { rerender } = render(
      <SignInForm
        {...defaultProps}
        enableEmailPassword={true}
        providers={[]}
      />,
      { wrapper: Providers },
    )

    expect(screen.queryByText('or')).not.toBeInTheDocument()

    rerender(<SignInForm {...defaultProps} enableEmailPassword={true} />)

    expect(screen.queryByText('or')).toBeInTheDocument()
  })
})
