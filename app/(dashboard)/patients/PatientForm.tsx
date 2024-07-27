//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
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

export const patientFormSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  displayName: z.string(),
  invitationCode: z.string(),
  clinician: z.string(),
  organizationId: z.string().optional(),
})

export type PatientFormSchema = z.infer<typeof patientFormSchema>

interface PatientFormProps {
  organizations: Array<Pick<Organization, 'name' | 'id'>>
  clinicians: Array<{
    id: string
    name: string
  }>
  userInfo?: Pick<UserInfo, 'email' | 'displayName' | 'uid'>
  user?: Pick<User, 'organization' | 'invitationCode'>
  onSubmit: (data: PatientFormSchema) => Promise<void>
}

export const PatientForm = ({
  organizations,
  user,
  clinicians,
  userInfo,
  onSubmit,
}: PatientFormProps) => {
  const isEdit = !!user
  const authUser = useUser()
  const form = useForm({
    formSchema: patientFormSchema,
    defaultValues: {
      email: userInfo?.email ?? '',
      displayName: userInfo?.displayName ?? '',
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
        name="clinician"
        label="Clinician"
        render={({ field }) => (
          <Select onValueChange={field.onChange} {...field}>
            <SelectTrigger>
              <SelectValue placeholder="Clinician" />
            </SelectTrigger>
            <SelectContent>
              {clinicians.map((clinician) => (
                <SelectItem value={clinician.id} key={clinician.id}>
                  {clinician.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Button type="submit" isPending={form.formState.isSubmitting}>
        {isEdit ? 'Edit' : 'Invite'} patient
      </Button>
    </form>
  )
}
