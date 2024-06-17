//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
/// <reference lib="webworker" />

import { type FirebaseOptions, initializeApp } from 'firebase/app'
import { getAuth, getIdToken, type Auth } from 'firebase/auth'
import { getInstallations, getToken } from 'firebase/installations'

/**
 * Get Firebase config from query string
 * */
export const getFirebaseConfig = () => {
  const serializedFirebaseConfig = new URL(location.href).searchParams.get(
    'firebaseConfig',
  )
  if (!serializedFirebaseConfig) {
    throw new Error(
      'Firebase Config object not found in service worker query string.',
    )
  }
  return JSON.parse(serializedFirebaseConfig) as FirebaseOptions
}

export const getAuthIdToken = async (auth: Auth) => {
  await auth.authStateReady()
  if (!auth.currentUser) return
  return getIdToken(auth.currentUser)
}

export const fetchWithFirebaseHeaders = async (
  firebaseConfig: FirebaseOptions,
  request: FetchEvent['request'],
) => {
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const installations = getInstallations(app)
  const headers = new Headers(request.headers)
  const [authIdToken, installationToken] = await Promise.all([
    getAuthIdToken(auth),
    getToken(installations),
  ])
  headers.append('Firebase-Instance-ID-Token', installationToken)
  if (authIdToken) headers.append('Authorization', `Bearer ${authIdToken}`)
  const newRequest = new Request(request, { headers })
  return fetch(newRequest)
}

/**
 * Appends Bearer token to every fetch request
 * This allows RSC and API endpoints to identify user
 * */
export const handleFetchEvent = (
  firebaseConfig: FirebaseOptions,
  event: FetchEvent,
) => {
  const { origin } = new URL(event.request.url)
  if (origin !== self.location.origin) return
  event.respondWith(fetchWithFirebaseHeaders(firebaseConfig, event.request))
}
