//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { z } from 'zod'
import { type User } from '@/modules/firebase/models'
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
import {
  getUserName,
  type UserInfo,
} from '@/packages/design-system/src/modules/auth/user'

export const patientFormSchema = z.object({
  email: z.string().email().min(1, 'Email is required'),
  displayName: z.string(),
  invitationCode: z.string(),
  clinician: z.string().min(1, 'Clinician is required'),
  dateOfBirth: z.date().optional(),
})

export type PatientFormSchema = z.infer<typeof patientFormSchema>

interface PatientFormProps {
  clinicians: Array<{
    id: string
    displayName: string | null
    email: string | null
  }>
  userInfo?: Pick<UserInfo, 'email' | 'displayName' | 'uid'>
  user?: Pick<
    User,
    'organization' | 'invitationCode' | 'clinician' | 'dateOfBirth'
  >
  onSubmit: (data: PatientFormSchema) => Promise<void>
  clinicianPreselectId?: string
}

export const PatientForm = ({
  user,
  clinicians,
  userInfo,
  onSubmit,
  clinicianPreselectId,
}: PatientFormProps) => {
  const isEdit = !!user
  const form = useForm({
    formSchema: patientFormSchema,
    defaultValues: {
      email: userInfo?.email ?? '',
      displayName: userInfo?.displayName ?? '',
      invitationCode: user?.invitationCode ?? '',
      clinician: user?.clinician ?? clinicianPreselectId ?? '',
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
                  {getUserName(clinician)}
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
