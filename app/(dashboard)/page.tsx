import { redirect } from 'next/navigation'
import { SignOutButton } from './SignOutButton'
import { getServerApp } from '../../modules/firebase/serverApp'
import { routes } from '../../modules/routes'

export const dynamic = 'force-dynamic'

const DashboardPage = async () => {
  const { currentUser } = await getServerApp()
  if (!currentUser) redirect(routes.signIn)

  return (
    <div className="grid gap-6 p-10 text-center">
      <h1 className="text-2xl">Dashboard</h1>
      <SignOutButton />
    </div>
  )
}

export default DashboardPage
