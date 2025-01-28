//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { queriesToAsyncProps } from "@stanfordspezi/spezi-web-design-system/components/Async";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/modules/firebase/UserProvider";
import { getNotificationPatientId } from "@/modules/notifications/helpers";
import { NotificationsTable } from "@/modules/notifications/NotificationsTable";
import { notificationQueries } from "@/modules/notifications/queries";

interface NotificationsProps {
  userId: string;
}

export const Notifications = ({ userId }: NotificationsProps) => {
  const { auth } = useUser();

  const notificationQuery = useQuery({
    ...notificationQueries.list({ userId: auth.uid }),
    select: (notifications) =>
      notifications.filter(
        (notification) => getNotificationPatientId(notification) === userId,
      ),
  });
  const notifications = notificationQuery.data ?? [];

  return (
    <NotificationsTable
      {...queriesToAsyncProps([notificationQuery])}
      notifications={notifications}
    />
  );
};
