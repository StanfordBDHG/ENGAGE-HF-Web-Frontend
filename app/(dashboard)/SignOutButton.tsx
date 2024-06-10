'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@stanfordbdhg/design-system/components/Button'
import { auth } from '../../modules/firebase/clientApp'
import { routes } from '../../modules/routes'

export const SignOutButton = () => {
  const router = useRouter()
  return (
    <Button
      variant="link"
      onClick={async () => {
        await auth.signOut()
        router.push(routes.signIn)
      }}
    >
      Sign out
    </Button>
  )
}
