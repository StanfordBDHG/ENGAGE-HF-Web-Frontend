//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type User } from '@firebase/auth-types'
import { redirect } from 'next/navigation'
import { routes } from '@/modules/routes'
import { getServerApp } from './serverApp'

/**
 * Redirects to home if authenticated
 * */
export const getUnauthenticatedOnlyApp = async () => {
  const firebaseApp = await getServerApp()
  if (firebaseApp.currentUser) redirect(routes.home)
  return firebaseApp
}

/**
 * Redirects to signIn if not authenticated
 * */
export const getAuthenticatedOnlyApp = async () => {
  const firebaseApp = await getServerApp()
  if (!firebaseApp.currentUser) redirect(routes.signIn)
  return firebaseApp as typeof firebaseApp & { currentUser: User }
}
