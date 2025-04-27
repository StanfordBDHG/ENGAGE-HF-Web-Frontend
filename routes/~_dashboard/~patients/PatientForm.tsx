//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { Button } from "@stanfordspezi/spezi-web-design-system/components/Button";
import { DatePicker } from "@stanfordspezi/spezi-web-design-system/components/DatePicker";
import { Input } from "@stanfordspezi/spezi-web-design-system/components/Input";
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
import {
  getUserName,
  type UserInfo,
} from "@stanfordspezi/spezi-web-design-system/modules/auth";
import { z } from "zod";
import { type User } from "@/modules/firebase/models";

export const patientFormSchema = z.object({
  displayName: z.string(),
  clinician: z.string().min(1, "Clinician is required"),
  dateOfBirth: z.date().optional(),
  providerName: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().nullable(),
  ),
});

export type PatientFormSchema = z.infer<typeof patientFormSchema>;

interface PatientFormProps {
  clinicians: Array<{
    id: string;
    displayName: string | null;
    email: string | null;
  }>;
  userInfo?: Pick<UserInfo, "email" | "displayName" | "uid">;
  user?: Pick<
    User,
    "organization" | "clinician" | "dateOfBirth" | "providerName"
  >;
  onSubmit: (data: PatientFormSchema) => Promise<void>;
  clinicianPreselectId?: string;
}

export const PatientForm = ({
  user,
  clinicians,
  userInfo,
  onSubmit,
  clinicianPreselectId,
}: PatientFormProps) => {
  const isEdit = !!user;
  const form = useForm({
    formSchema: patientFormSchema,
    defaultValues: {
      displayName: userInfo?.displayName ?? "",
      clinician: user?.clinician ?? clinicianPreselectId ?? "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
      providerName: user?.providerName ?? "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
      <FormError
        prefix={`${isEdit ? "Updating" : "Inviting"} patient failed. `}
        formError={form.formError}
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
            endMonth={new Date()}
            hidden={{
              after: new Date(),
            }}
          />
        )}
      />
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
      <Field
        control={form.control}
        name="providerName"
        label="Provider name"
        tooltip={
          <div>
            Displayed as "Provider" of the Health Report. <br />
            If "Provider name" is not set, assigned clinician will be shown.
          </div>
        }
        render={({ field }) => <Input {...field} value={field.value ?? ""} />}
      />
      <Button type="submit" isPending={form.formState.isSubmitting}>
        {isEdit ? "Update" : "Invite"} patient
      </Button>
    </form>
  );
};
