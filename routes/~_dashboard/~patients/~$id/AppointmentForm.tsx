//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type ComponentProps } from 'react'
import { z } from 'zod'
import { Button } from '@/packages/design-system/src/components/Button'
import { DatePicker } from '@/packages/design-system/src/components/DatePicker'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/packages/design-system/src/components/Dialog'
import { Input } from '@/packages/design-system/src/components/Input'
import { Textarea } from '@/packages/design-system/src/components/Textarea'
import { Field } from '@/packages/design-system/src/forms/Field'
import { useForm } from '@/packages/design-system/src/forms/useForm'
import { type Appointment } from '@/routes/~_dashboard/~patients/utils'

export const appointmentFormSchema = z.object({
  start: z.date(),
  comment: z.string().nullable(),
  patientInstruction: z.string().nullable(),
  providerName: z.string(),
})

export type AppointmentFormSchema = z.infer<typeof appointmentFormSchema>

interface AppointmentFormProps {
  appointment?: Appointment
  onSubmit: (data: AppointmentFormSchema) => Promise<void>
}

export const AppointmentForm = ({
  appointment,
  onSubmit,
}: AppointmentFormProps) => {
  const isEdit = !!appointment
  const form = useForm({
    formSchema: appointmentFormSchema,
    defaultValues: {
      start: appointment ? new Date(appointment.start) : undefined,
      comment: appointment?.comment ?? null,
      patientInstruction: appointment?.patientInstruction ?? null,
      providerName: appointment?.providerName ?? '',
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <form onSubmit={handleSubmit}>
      <Field
        control={form.control}
        name="start"
        label="Start"
        render={({ field }) => (
          <DatePicker
            mode="single"
            selected={field.value}
            onSelect={(date) => field.onChange(date)}
            defaultMonth={field.value}
            fromDate={new Date()}
            showTimePicker
          />
        )}
      />
      <Field
        control={form.control}
        name="providerName"
        label="Provider"
        render={({ field }) => <Input {...field} />}
      />
      <Field
        control={form.control}
        name="comment"
        label="Comment"
        render={({ field }) => (
          <Textarea {...field} value={field.value ?? ''} />
        )}
      />
      <Field
        control={form.control}
        name="patientInstruction"
        label="Patient Instruction"
        render={({ field }) => (
          <Textarea {...field} value={field.value ?? ''} />
        )}
      />
      <Button type="submit" isPending={form.formState.isSubmitting}>
        {isEdit ? 'Edit' : 'Create'} appointment
      </Button>
    </form>
  )
}

type AppointmentFormDialogProps = AppointmentFormProps &
  Pick<ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>

export const AppointmentFormDialog = ({
  open,
  onOpenChange,
  appointment,
  ...props
}: AppointmentFormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{appointment ? 'Edit' : 'Create'} appointment</DialogTitle>
      </DialogHeader>
      <AppointmentForm {...props} appointment={appointment} />
    </DialogContent>
  </Dialog>
)
