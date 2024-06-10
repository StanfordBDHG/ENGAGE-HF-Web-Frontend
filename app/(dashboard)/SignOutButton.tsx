//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { Button } from '@stanfordbdhg/design-system/components/Button'
import { auth } from '../../modules/firebase/clientApp'

export const SignOutButton = () => (
  <Button
    variant="link"
    onClick={async () => {
      await auth.signOut()
    }}
  >
    Sign out
  </Button>
)
