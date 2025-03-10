//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { PageTitle } from "@stanfordspezi/spezi-web-design-system/molecules/DashboardLayout";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Helmet } from "react-helmet";
import {
  currentUserQueryOptions,
  useUser,
} from "@/modules/firebase/UserProvider";
import { NotificationsTable } from "@/modules/notifications/NotificationsTable";
import { notificationQueries } from "@/modules/notifications/queries";
import { queryClient } from "@/modules/query/queryClient";
import { DashboardLayout } from "../DashboardLayout";

const NotificationsPage = () => {
  const { auth } = useUser();
  const { data: notifications } = useSuspenseQuery(
    notificationQueries.list({ userId: auth.uid }),
  );

  return (
    <DashboardLayout
      title={<PageTitle title="Notifications" icon={<Bell />} />}
    >
      <Helmet>
        <title>Notifications</title>
      </Helmet>
      <NotificationsTable notifications={notifications} />
    </DashboardLayout>
  );
};

export const Route = createFileRoute("/_dashboard/notifications/")({
  component: NotificationsPage,
  loader: async () => {
    const user = await queryClient.ensureQueryData(currentUserQueryOptions());
    await queryClient.ensureQueryData(
      notificationQueries.list({ userId: user.auth.uid }),
    );
  },
});
