//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { UserType } from "@stanfordbdhg/engagehf-models";
import { Button } from "@stanfordspezi/spezi-web-design-system/components/Button";
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
import { type UserInfo } from "@stanfordspezi/spezi-web-design-system/modules/auth";
import { z } from "zod";
import { type Organization, type User } from "@/modules/firebase/models";
import { useUser } from "@/modules/firebase/UserProvider";

export const userFormSchema = z
  .object({
    email: z.string().email().min(1, "Email is required"),
    displayName: z.string(),
    organizationId: z.string().nullable(),
    type: z.nativeEnum(UserType),
  })
  .superRefine((schema, ctx) => {
    if (schema.type !== UserType.admin && !schema.organizationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Organization is required",
        path: ["organizationId"],
      });
    }
  });

export type UserFormSchema = z.infer<typeof userFormSchema>;

interface UserFormProps {
  organizations: Array<Pick<Organization, "name" | "id">>;
  userInfo?: Pick<UserInfo, "email" | "displayName" | "uid">;
  user?: Pick<User, "organization">;
  type?: UserType;
  onSubmit: (data: UserFormSchema) => Promise<void>;
}

export const UserForm = ({
  organizations,
  user,
  type,
  userInfo,
  onSubmit,
}: UserFormProps) => {
  const isEdit = !!user;
  const authUser = useUser();
  const form = useForm({
    formSchema: userFormSchema,
    defaultValues: {
      email: userInfo?.email ?? "",
      displayName: userInfo?.displayName ?? "",
      type: type ?? UserType.clinician,
      organizationId:
        (authUser.user.type === UserType.owner ?
          authUser.user.organization
        : user?.organization) ?? null,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
      <FormError
        prefix={`${isEdit ? "Updating" : "Inviting"} user failed. `}
        formError={form.formError}
      />
      <Field
        control={form.control}
        name="email"
        label="Email"
        tooltip="Email should be the unique SSO indentifier of your organization"
        render={({ field }) => <Input type="email" {...field} />}
      />
      <Field
        control={form.control}
        name="displayName"
        label="Display name"
        render={({ field }) => <Input {...field} />}
      />
      {authUser.user.type === UserType.admin && (
        <Field
          control={form.control}
          name="organizationId"
          label="Organization"
          render={({ field }) => (
            <Select
              {...field}
              onValueChange={field.onChange}
              value={field.value ?? undefined}
            >
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
        {isEdit ? "Update" : "Invite"} user
      </Button>
    </form>
  );
};
