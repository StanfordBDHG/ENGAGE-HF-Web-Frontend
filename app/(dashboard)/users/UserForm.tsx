'use client'
import { z } from 'zod'
import { Role } from '@/modules/firebase/role'
import { useUser } from '@/modules/firebase/UserProvider'
import { type Organization, type User } from '@/modules/firebase/utils'
import { Button } from '@/packages/design-system/src/components/Button'
import { Input } from '@/packages/design-system/src/components/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/packages/design-system/src/components/Select'
import { Field } from '@/packages/design-system/src/forms/Field'
import { useForm } from '@/packages/design-system/src/forms/useForm'
import { type UserInfo } from '@/packages/design-system/src/modules/auth/user'

export const userFormSchema = z
  .object({
    email: z.string().min(1, 'Email is required'),
    displayName: z.string(),
    invitationCode: z.string(),
    organizationId: z.string().optional(),
    role: z.nativeEnum(Role),
  })
  .superRefine((schema, ctx) => {
    if (schema.role !== Role.admin && !schema.organizationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Organization is required',
        path: ['organizationId'],
      })
    }
  })

export type UserFormSchema = z.infer<typeof userFormSchema>

interface UserFormProps {
  organizations: Array<Pick<Organization, 'name' | 'id'>>
  userInfo?: Pick<UserInfo, 'email' | 'displayName' | 'uid'>
  user?: Pick<User, 'organization' | 'invitationCode'>
  role?: Role
  onSubmit: (data: UserFormSchema) => Promise<void>
}

export const UserForm = ({
  organizations,
  user,
  role,
  userInfo,
  onSubmit,
}: UserFormProps) => {
  const isEdit = !!user
  const authUser = useUser()
  const form = useForm({
    formSchema: userFormSchema,
    defaultValues: {
      email: userInfo?.email ?? '',
      displayName: userInfo?.displayName ?? '',
      role: role ?? Role.clinician,
      organizationId:
        authUser.role === Role.owner ?
          authUser.organization
        : user?.organization,
      invitationCode: user?.invitationCode ?? '',
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
      <Field
        control={form.control}
        name="email"
        label="Email"
        render={({ field }) => <Input type="email" {...field} />}
      />
      <Field
        control={form.control}
        name="displayName"
        label="Display name"
        render={({ field }) => <Input {...field} />}
      />
      {isEdit && (
        <Field
          control={form.control}
          name="invitationCode"
          label="Invitation code"
          render={({ field }) => <Input {...field} />}
        />
      )}
      {authUser.role === Role.admin && (
        <Field
          control={form.control}
          name="organizationId"
          label="Organization"
          render={({ field }) => (
            <Select onValueChange={field.onChange} {...field}>
              <SelectTrigger>
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((organization) => (
                  <SelectItem value={organization.id} key={organization.id}>
                    {organization.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      )}
      <Field
        control={form.control}
        name="role"
        label="Role"
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            {...field}
            disabled={authUser.uid === userInfo?.uid}
          >
            <SelectTrigger>
              <SelectValue placeholder="Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Role.clinician} itemText="Clinician">
                <div className="flex flex-col">
                  <b>Clinician</b>
                  <p>Clinician can access their organization data </p>
                </div>
              </SelectItem>
              <SelectItem value={Role.owner} itemText="Organization owner">
                <div className="flex flex-col">
                  <b>Organization owner</b>
                  <p>
                    Organization owner can manage their organization users and
                    data
                  </p>
                </div>
              </SelectItem>
              {authUser.role === Role.admin && (
                <SelectItem value={Role.admin} itemText="Admin">
                  <div className="flex flex-col">
                    <b>Admin</b>
                    <p>Admin can modify every organization and invite users</p>
                  </div>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        )}
      />
      <Button type="submit" isPending={form.formState.isSubmitting}>
        Save user
      </Button>
    </form>
  )
}
