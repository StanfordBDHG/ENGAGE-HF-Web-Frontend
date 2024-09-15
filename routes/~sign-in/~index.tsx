//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { createFileRoute } from '@tanstack/react-router'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { Helmet } from 'react-helmet'
import { AsideEngageLayout } from '@/components/AsideEngageLayout'
import { authProvider, auth } from '@/modules/firebase/app'
import { SignInForm as AuthSignInForm } from '@/packages/design-system/src/modules/auth/SignInForm'

const SignIn = () => (
  <AsideEngageLayout>
    <Helmet>
      <title>Sign In</title>
    </Helmet>
    <AuthSignInForm
      className="mx-auto w-[350px]"
      providers={[
        { name: 'Apple', provider: authProvider.apple },
        { name: 'Stanford', provider: authProvider.stanford },
      ]}
      enableEmailPassword
      auth={auth}
      signInWithPopup={signInWithPopup}
      signInWithEmailAndPassword={signInWithEmailAndPassword}
    />
  </AsideEngageLayout>
)

export const Route = createFileRoute('/sign-in/')({
  component: SignIn,
})
