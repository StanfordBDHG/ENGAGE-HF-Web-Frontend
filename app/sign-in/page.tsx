//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { SignInForm } from './SignInForm'
import { unauthenticatedOnly } from '../../modules/firebase/guards'

export const dynamic = 'force-dynamic'

const SignInPage = async () => {
  await unauthenticatedOnly()
  return <SignInForm />
}

export default SignInPage
