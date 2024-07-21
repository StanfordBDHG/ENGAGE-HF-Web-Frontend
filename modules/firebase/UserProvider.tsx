//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { type UserInfo } from '@firebase/auth-types'
import { createContext, type ReactNode, useContext } from 'react'

export const UserContext = createContext<UserInfo | undefined>(undefined)

interface UserContextProviderProps {
  children?: ReactNode
  user: UserInfo
}

export const UserContextProvider = ({
  children,
  user,
}: UserContextProviderProps) => (
  <UserContext.Provider value={user}>{children}</UserContext.Provider>
)

export const useUser = () => {
  const value = useContext(UserContext)
  if (!value) {
    throw new Error('Rendered user context without provider')
  }
  return value
}
