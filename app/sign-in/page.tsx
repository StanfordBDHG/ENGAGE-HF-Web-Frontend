import { redirect } from 'next/navigation'
import { SignInForm } from './SignInForm'
import { getServerApp } from '../../modules/firebase/serverApp'
import { routes } from '../../modules/routes'

export const dynamic = 'force-dynamic'

const SignInPage = async () => {
  const { currentUser } = await getServerApp()
  if (currentUser) redirect(routes.home)
  return <SignInForm />
}

export default SignInPage
