import { type FirebaseOptions, initializeServerApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { headers } from 'next/headers'

export const getServerApp = async (firebaseOptions: FirebaseOptions) => {
  const idToken = headers().get('Authorization')?.split('Bearer ').at(1)

  const firebaseServerApp = initializeServerApp(
    firebaseOptions,
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
