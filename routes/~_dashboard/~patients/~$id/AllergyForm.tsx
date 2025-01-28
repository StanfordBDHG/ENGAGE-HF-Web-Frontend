//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { Button } from "@stanfordspezi/spezi-web-design-system/components/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@stanfordspezi/spezi-web-design-system/components/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@stanfordspezi/spezi-web-design-system/components/Select";
import {
  Field,
  FormError,
  useForm,
} from "@stanfordspezi/spezi-web-design-system/forms";
import { type ComponentProps } from "react";
import { z } from "zod";
import { AllergyType, stringifyAllergyType } from "@/modules/firebase/allergy";
import { MedicationSelect } from "@/routes/~_dashboard/~patients/MedicationSelect";
import {
  type Allergy,
  type MedicationsData,
} from "@/routes/~_dashboard/~patients/utils";

export const allergyFormSchema = z.object({
  medication: z.string(),
  type: z.nativeEnum(AllergyType),
});

export type AllergyFormSchema = z.infer<typeof allergyFormSchema>;

interface AllergyFormProps extends MedicationsData {
  allergy?: Allergy;
  onSubmit: (data: AllergyFormSchema) => Promise<void>;
}

export const AllergyForm = ({
  allergy,
  onSubmit,
  medications,
}: AllergyFormProps) => {
  const isEdit = !!allergy;
  const form = useForm({
    formSchema: allergyFormSchema,
    defaultValues: {
      type: allergy?.type,
      medication: allergy?.medication ?? undefined,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormError
        prefix={`${isEdit ? "Updating" : "Creating"} allergy failed. `}
        formError={form.formError}
      />
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
        {isEdit ? "Update" : "Create"} allergy
      </Button>
    </form>
  );
};

type AllergyFormDialogProps = AllergyFormProps &
  Pick<ComponentProps<typeof Dialog>, "open" | "onOpenChange">;

export const AllergyFormDialog = ({
  open,
  onOpenChange,
  allergy,
  ...props
}: AllergyFormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{allergy ? "Edit" : "Create"} allergy</DialogTitle>
      </DialogHeader>
      <AllergyForm {...props} allergy={allergy} />
    </DialogContent>
  </Dialog>
);
