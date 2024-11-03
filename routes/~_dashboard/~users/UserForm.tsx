//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { UserType } from '@stanfordbdhg/engagehf-models'
import { z } from 'zod'
import { type Organization, type User } from '@/modules/firebase/models'
import { useUser } from '@/modules/firebase/UserProvider'
import { Button } from '@/packages/design-system/src/components/Button'
import { DatePicker } from '@/packages/design-system/src/components/DatePicker'
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
    email: z.string().email().min(1, 'Email is required'),
    displayName: z.string(),
    invitationCode: z.string(),
    dateOfBirth: z.date().optional(),
    organizationId: z.string().optional(),
    type: z.nativeEnum(UserType),
  })
  .superRefine((schema, ctx) => {
    if (schema.type !== UserType.admin && !schema.organizationId) {
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
  user?: Pick<User, 'organization' | 'invitationCode' | 'dateOfBirth'>
  type?: UserType
  onSubmit: (data: UserFormSchema) => Promise<void>
}

export const UserForm = ({
  organizations,
  user,
  type,
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
      type: type ?? UserType.clinician,
      organizationId:
        (authUser.user.type === UserType.owner ?
          authUser.user.organization
        : user?.organization) ?? undefined,
      invitationCode: user?.invitationCode ?? '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
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
      <Field
        control={form.control}
        name="dateOfBirth"
        label="Date of Birth"
        render={({ field }) => (
          <DatePicker
            mode="single"
            selected={field.value}
            onSelect={(date) => field.onChange(date)}
            defaultMonth={field.value}
            toYear={new Date().getFullYear()}
          />
        )}
      />
      {isEdit && (
        <Field
          control={form.control}
          name="invitationCode"
          label="Invitation code"
          render={({ field }) => <Input {...field} />}
        />
      )}
      {authUser.user.type === UserType.admin && (
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
        name="type"
        label="Type"
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            {...field}
            disabled={authUser.auth.uid === userInfo?.uid}
          >
            <SelectTrigger>
              <SelectValue placeholder="Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserType.clinician} itemText="Clinician">
                <div className="flex flex-col">
                  <b>Clinician</b>
                  <p>Clinician can access their organization data </p>
                </div>
              </SelectItem>
              <SelectItem value={UserType.owner} itemText="Organization owner">
                <div className="flex flex-col">
                  <b>Organization owner</b>
                  <p>
                    Organization owner can manage their organization users and
                    data
                  </p>
                </div>
              </SelectItem>
              {authUser.user.type === UserType.admin && (
                <SelectItem value={UserType.admin} itemText="Admin">
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
        {isEdit ? 'Update' : 'Invite'} user
      </Button>
    </form>
  )
}
