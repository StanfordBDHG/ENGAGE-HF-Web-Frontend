//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { redirect } from 'next/navigation'
import { SignInForm } from './SignInForm'
import { getServerApp } from '../../modules/firebase/serverApp'
import { routes } from '../../modules/routes'

export const dynamic = 'force-dynamic'

const SignInPage = async () => {
  const { currentUser } = await getServerApp()
  if (currentUser) redirect(routes.home)
  return <SignInForm />
}

export default SignInPage
