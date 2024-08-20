//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { type ComponentProps } from 'react'
import { z } from 'zod'
import { type Appointment } from '@/app/(dashboard)/patients/utils'
import { Button } from '@/packages/design-system/src/components/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/packages/design-system/src/components/Dialog'
import { useForm } from '@/packages/design-system/src/forms/useForm'

export const appointmentFormSchema = z.object({})

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
    defaultValues: {},
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <form onSubmit={handleSubmit}>
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
