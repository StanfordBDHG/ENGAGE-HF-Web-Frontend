//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { type Auth } from 'firebase/auth'
import { EmailPasswordForm } from './EmailPasswordForm'
import { Providers } from '../../../../tests/Providers'

const authMock = {} as Auth
const signInWithEmailAndPasswordMock = jest.fn()

jest.mock('firebase/auth')

const getEmailField = () => screen.getByLabelText('Email')
const getPasswordField = () => screen.getByLabelText('Password')
const getSubmitButton = () => screen.getByRole('button')

const validCreds = {
  email: 'example@example.com',
  password: 'example1234',
}

const signIn = async () => {
  const user = userEvent.setup()
  await user.type(getEmailField(), validCreds.email)
  await user.type(getPasswordField(), validCreds.password)
  await user.click(getSubmitButton())
}

class InvalidCredsError extends Error {
  code: string
  constructor() {
    super('invalidcreds')
    this.code = 'auth/invalid-credential'
  }
}

describe('EmailPasswordForm', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('calls signIn function', async () => {
    render(
      <EmailPasswordForm
        signInWithEmailAndPassword={signInWithEmailAndPasswordMock}
        auth={authMock}
      />,
      { wrapper: Providers },
    )
    await signIn()

    expect(signInWithEmailAndPasswordMock).toHaveBeenLastCalledWith(
      expect.anything(),
      validCreds.email,
      validCreds.password,
    )
  })

  it('validates against empty values', async () => {
    const user = userEvent.setup()
    render(
      <EmailPasswordForm
        signInWithEmailAndPassword={signInWithEmailAndPasswordMock}
        auth={authMock}
      />,
      { wrapper: Providers },
    )

    await user.type(getPasswordField(), 'something')
    await user.click(getSubmitButton())

    screen.debug()

    expect(getEmailField()).toHaveAccessibleErrorMessage()
    expect(signInWithEmailAndPasswordMock).not.toHaveBeenCalled()
  })

  it('handles', async () => {
    signInWithEmailAndPasswordMock.mockImplementation(() => {
      throw new InvalidCredsError()
    })
    render(
      <EmailPasswordForm
        signInWithEmailAndPassword={signInWithEmailAndPasswordMock}
        auth={authMock}
      />,
      { wrapper: Providers },
    )

    await signIn()

    expect(
      screen.getByText('Provided credentials are wrong. Please try again.'),
    ).toBeInTheDocument()
  })
})
