'use server'
import { revalidatePath } from 'next/cache'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { routes } from '@/modules/routes'

export const deleteUser = async (payload: { userId: string }) => {
  const { callables } = await getAuthenticatedOnlyApp()
  await callables.deleteUser(payload)
  revalidatePath(routes.users.index)
  return 'success'
}
