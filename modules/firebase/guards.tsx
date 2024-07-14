//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type User } from '@firebase/auth-types'
import { type FirebaseOptions, initializeServerApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  doc,
  type DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { firebaseConfig } from '@/modules/firebase/config'
import { Role } from '@/modules/firebase/role'
import {
  type Clinician,
  collectionNames,
  getCollectionRefs,
} from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'

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

  const db = getFirestore(firebaseServerApp)
  return {
    firebaseServerApp,
    currentUser: auth.currentUser,
    db,
    refs: getCollectionRefs(db),
  }
}

export const getUserRole = async () => {
  const { currentUser, db } = await getAuthenticatedOnlyApp()
  const adminDocRef = doc(db, collectionNames.admins, currentUser.uid)
  const adminDoc = await getDoc(adminDocRef)
  if (adminDoc.exists())
    return {
      role: Role.admin,
    } as const
  const clinicianDocRef = doc(
    db,
    collectionNames.clinicians,
    currentUser.uid,
  ) as DocumentReference<Clinician>
  const clinicianDoc = await getDoc(clinicianDocRef)
  if (clinicianDoc.exists())
    return {
      role: Role.clinician,
      clinician: clinicianDoc,
    } as const
  const organizationsRef = getCollectionRefs(db).organizations()
  const organizationsQuery = query(
    organizationsRef,
    where('owners', 'array-contains-any', [currentUser.uid]),
  )
  const organizationsDocs = await getDocs(organizationsQuery)
  if (!organizationsDocs.empty)
    return {
      role: Role.owner as const,
      organizations: organizationsDocs,
    } as const
  return { role: Role.user } as const
}

/**
 * Redirects to home if authenticated
 * */
export const getUnauthenticatedOnlyApp = async () => {
  const firebaseApp = await getServerApp(firebaseConfig)
  if (firebaseApp.currentUser) redirect(routes.home)
  return firebaseApp
}

/**
 * Redirects to signIn if not authenticated
 * */
export const getAuthenticatedOnlyApp = async () => {
  const firebaseApp = await getServerApp(firebaseConfig)
  if (!firebaseApp.currentUser) redirect(routes.signIn)
  return firebaseApp as typeof firebaseApp & { currentUser: User }
}

/**
 * Redirects to 403 if user's role d
 * */
export const allowRoles = async (roles: Role[]) => {
  const { role } = await getUserRole()
  // TODO: HTTP Error
  if (!roles.includes(role)) redirect(routes.home)
}
