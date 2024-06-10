//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { initializeServerApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { headers } from 'next/headers'
import { firebaseConfig } from './config'

export const getServerApp = async () => {
  const idToken = headers().get('Authorization')?.split('Bearer ').at(1)

  const firebaseServerApp = initializeServerApp(
    firebaseConfig,
    idToken ?
      {
        authIdToken: idToken,
      }
    : {},
  )

  const auth = getAuth(firebaseServerApp)
  await auth.authStateReady()

  return { firebaseServerApp, currentUser: auth.currentUser }
}
