'use server'
import { revalidatePath } from 'next/cache'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'

export const deletePatient = async (payload: { userId: string }) => {
  const { callables } = await getAuthenticatedOnlyApp()
  await callables.deleteUser(payload)
  revalidatePath('/patients')
  return 'success'
}
