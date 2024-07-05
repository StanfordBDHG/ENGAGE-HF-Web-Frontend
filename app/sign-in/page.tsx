//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { SignInForm } from './SignInForm'
import { getUnauthenticatedOnlyApp } from '../../modules/firebase/guards'

export const dynamic = 'force-dynamic'

const SignInPage = async () => {
  await getUnauthenticatedOnlyApp()
  return <SignInForm />
}

export default SignInPage
