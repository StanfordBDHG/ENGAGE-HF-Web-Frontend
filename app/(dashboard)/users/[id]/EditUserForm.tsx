'use client'
import { Role } from '@/modules/firebase/role'
import { useUser } from '@/modules/firebase/UserProvider'
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
import type { Data } from './page'
import { type EditUserFormSchema, editUserFormSchema } from './utils'

interface EditUserDialogFormProps {
  data: Data
  onSubmit: (data: EditUserFormSchema) => Promise<void>
}

export const EditUserForm = ({ data, onSubmit }: EditUserDialogFormProps) => {
  const authUser = useUser()
  const form = useForm({
    formSchema: editUserFormSchema,
    defaultValues: {
      email: data.authUser.email ?? '',
      displayName: data.authUser.displayName ?? '',
      role: data.role.role,
      organizationId: data.user?.organization,
      invitationCode: data.user?.invitationCode,
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <form onSubmit={handleSubmit}>
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
        name="invitationCode"
        label="Invitation code"
        render={({ field }) => <Input {...field} />}
      />
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
                {data.organizations.map((organization) => (
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
            disabled={authUser.uid === data.authUser.id}
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
              <SelectItem value={Role.admin} itemText="Admin">
                <div className="flex flex-col">
                  <b>Admin</b>
                  <p>Admin can modify every organization and invite users</p>
                </div>
              </SelectItem>
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
