import { z } from 'zod'
import { Role } from '@/modules/firebase/role'

export const editUserFormSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  displayName: z.string(),
  invitationCode: z.string().optional(),
  organizationId: z.string().optional(),
  role: z.nativeEnum(Role),
})

export type EditUserFormSchema = z.infer<typeof editUserFormSchema>
