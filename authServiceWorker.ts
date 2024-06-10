/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope

import { initializeApp } from 'firebase/app'
import { getAuth, getIdToken, type Auth } from 'firebase/auth'
import { getInstallations, getToken } from 'firebase/installations'

let firebaseConfig: object

/**
 * Get Firebase config from query string
 * */
const getFirebaseConfig = () => {
  const serializedFirebaseConfig = new URL(location.href).searchParams.get(
    'firebaseConfig',
  )
  if (!serializedFirebaseConfig) {
    throw new Error(
      'Firebase Config object not found in service worker query string.',
    )
  }
  return JSON.parse(serializedFirebaseConfig) as object
}

const getAuthIdToken = async (auth: Auth) => {
  await auth.authStateReady()
  if (!auth.currentUser) return
  return getIdToken(auth.currentUser)
}

const fetchWithFirebaseHeaders = async (request: FetchEvent['request']) => {
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

self.addEventListener('install', () => {
  firebaseConfig = getFirebaseConfig()
})

self.addEventListener('fetch', (event) => {
  const { origin } = new URL(event.request.url)
  if (origin !== self.location.origin) return
  event.respondWith(fetchWithFirebaseHeaders(event.request))
})
