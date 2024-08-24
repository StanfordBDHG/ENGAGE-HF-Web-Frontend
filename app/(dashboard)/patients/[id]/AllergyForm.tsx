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
import { MedicationSelect } from '@/app/(dashboard)/patients/MedicationSelect'
import {
  type Allergy,
  type MedicationsData,
} from '@/app/(dashboard)/patients/utils'
import {
  AllergyType,
  stringifyAllergyType,
} from '@/modules/firebase/models/allergy'
import { Button } from '@/packages/design-system/src/components/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/packages/design-system/src/components/Dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/packages/design-system/src/components/Select'
import { Field } from '@/packages/design-system/src/forms/Field'
import { useForm } from '@/packages/design-system/src/forms/useForm'

export const allergyFormSchema = z.object({
  medication: z.string(),
  type: z.nativeEnum(AllergyType),
})

export type AllergyFormSchema = z.infer<typeof allergyFormSchema>

interface AllergyFormProps extends MedicationsData {
  allergy?: Allergy
  onSubmit: (data: AllergyFormSchema) => Promise<void>
}

export const AllergyForm = ({
  allergy,
  onSubmit,
  medications,
}: AllergyFormProps) => {
  const isEdit = !!allergy
  const form = useForm({
    formSchema: allergyFormSchema,
    defaultValues: {
      type: allergy?.type,
      medication: allergy?.medication,
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <form onSubmit={handleSubmit}>
      <Field
        control={form.control}
        name="type"
        label="Type"
        render={({ field }) => (
          <Select onValueChange={field.onChange} {...field}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(AllergyType).map((type) => (
                <SelectItem key={type} value={type}>
                  {stringifyAllergyType(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Field
        control={form.control}
        name="medication"
        label="Medication"
        render={({ field }) => (
          <MedicationSelect
            medications={medications}
            onValueChange={field.onChange}
            {...field}
          />
        )}
      />
      <Button type="submit" isPending={form.formState.isSubmitting}>
        {isEdit ? 'Edit' : 'Create'} allergy
      </Button>
    </form>
  )
}

type AllergyFormDialogProps = AllergyFormProps &
  Pick<ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>

export const AllergyFormDialog = ({
  open,
  onOpenChange,
  allergy,
  ...props
}: AllergyFormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{allergy ? 'Edit' : 'Create'} allergy</DialogTitle>
      </DialogHeader>
      <AllergyForm {...props} allergy={allergy} />
    </DialogContent>
  </Dialog>
)
