//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { redirect } from 'next/navigation'
import { getServerApp } from './serverApp'
import { routes } from '../routes'

/**
 * Redirects to home if authenticated
 * */
export const unauthenticatedOnly = async () => {
  const { currentUser } = await getServerApp()
  if (currentUser) redirect(routes.home)
}

/**
 * Redirects to signIn if not authenticated
 * */
export const authenticatedOnly = async () => {
  const { currentUser } = await getServerApp()
  if (!currentUser) redirect(routes.signIn)
}
