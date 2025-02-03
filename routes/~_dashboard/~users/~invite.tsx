//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { UserType } from "@stanfordbdhg/engagehf-models";
import { toast } from "@stanfordspezi/spezi-web-design-system/components/Toaster";
import { PageTitle } from "@stanfordspezi/spezi-web-design-system/molecules/DashboardLayout";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { Helmet } from "react-helmet";
import { callables, ensureType } from "@/modules/firebase/app";
import { queryClient } from "@/modules/query/queryClient";
import { routes } from "@/modules/routes";
import { userOrganizationQueryOptions } from "@/modules/user/queries";
import { DashboardLayout } from "@/routes/~_dashboard/DashboardLayout";
import {
  UserForm,
  type UserFormSchema,
} from "@/routes/~_dashboard/~users/UserForm";

const InviteUserPage = () => {
  const navigate = useNavigate();
  const { organizations } = Route.useLoaderData();

  const inviteUser = async (form: UserFormSchema) => {
    const result = await callables.createInvitation({
      auth: {
        displayName: form.displayName,
        email: form.email,
      },
      user: {
        ...(form.organizationId ? { organization: form.organizationId } : {}),
        type: form.type,
      },
    });
    toast.success("User has been successfully invited!");
    void navigate({ to: routes.users.user(result.data.id, "invitation") });
  };

  return (
    <DashboardLayout title={<PageTitle title="Invite user" icon={<Users />} />}>
      <Helmet>
        <title>Invite user</title>
      </Helmet>
      <UserForm organizations={organizations} onSubmit={inviteUser} />
    </DashboardLayout>
  );
};

export const Route = createFileRoute("/_dashboard/users/invite")({
  component: InviteUserPage,
  loader: async () => ({
    organizations: await queryClient.ensureQueryData(
      userOrganizationQueryOptions(),
    ),
  }),
  beforeLoad: () => ensureType([UserType.admin, UserType.owner]),
});
