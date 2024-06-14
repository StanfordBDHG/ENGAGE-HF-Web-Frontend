import { type ReactNode } from 'react'
import { authenticatedOnly } from '../../modules/firebase/guards'

interface DashboardLayoutProps {
  children?: ReactNode
}

export const dynamic = 'force-dynamic'

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  await authenticatedOnly()
  return children
}

export default DashboardLayout
