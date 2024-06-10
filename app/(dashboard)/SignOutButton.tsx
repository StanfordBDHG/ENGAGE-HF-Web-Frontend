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
