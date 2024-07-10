//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { SignInForm as AuthSignInForm } from '@stanfordbdhg/design-system/modules/auth/SignInForm'
import { auth, authProvider } from '../../modules/firebase/clientApp'

export const SignInForm = () => (
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
)
