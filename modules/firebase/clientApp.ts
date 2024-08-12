//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { initializeApp } from '@firebase/app'
import { connectFunctionsEmulator, getFunctions } from '@firebase/functions'
import { OAuthProvider, getAuth, connectAuthEmulator } from 'firebase/auth'
import { env } from '@/env'
import { getCallables } from '@/modules/firebase/utils'
import { firebaseConfig } from './config'

export const app = initializeApp(firebaseConfig)

export const authProvider = {
  stanford: new OAuthProvider('oidc.stanford'),
  apple: new OAuthProvider('apple.com'),
}

export const auth = getAuth()
const enableEmulation = env.NEXT_PUBLIC_EMULATOR && !auth.emulatorConfig
if (enableEmulation) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
    disableWarnings: true,
  })
}
const functions = getFunctions(app)
if (enableEmulation) connectFunctionsEmulator(functions, '127.0.0.1', 5001)

export const callables = getCallables(functions)
