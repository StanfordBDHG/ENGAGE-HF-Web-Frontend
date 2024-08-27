//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'

interface ReactQueryClientProviderProps {
  children: ReactNode
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

export const ReactQueryClientProvider = ({
  children,
}: ReactQueryClientProviderProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
