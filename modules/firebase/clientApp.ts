//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { initializeApp } from '@firebase/app'
import { OAuthProvider, getAuth } from 'firebase/auth'
import { firebaseConfig } from './config'

export const app = initializeApp(firebaseConfig)

export const authProvider = {
  stanford: new OAuthProvider('oidc.stanford'),
  apple: new OAuthProvider('apple.com'),
}

export const auth = getAuth()
