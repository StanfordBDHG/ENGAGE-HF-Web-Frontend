//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import {
  Async,
  queriesToAsyncProps,
} from "@stanfordspezi/spezi-web-design-system/components/Async";
import { Button } from "@stanfordspezi/spezi-web-design-system/components/Button";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@stanfordspezi/spezi-web-design-system/components/Card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useUser } from "@/modules/firebase/UserProvider";
import { filterUnreadNotifications } from "@/modules/notifications/helpers";
import { Notification } from "@/modules/notifications/Notification";
import { notificationQueries } from "@/modules/notifications/queries";
import { routes } from "@/modules/routes";

export const NotificationsCard = () => {
  const { auth } = useUser();

  const notificationQuery = useQuery({
    ...notificationQueries.list({ userId: auth.uid }),
    select: (notifications) =>
      filterUnreadNotifications(notifications).slice(0, 3),
  });
  const notifications = notificationQuery.data ?? [];

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <Async
        {...queriesToAsyncProps([notificationQuery])}
        empty={notifications.length === 0}
        entityName="unread notifications"
      >
        <div>
          {notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} />
          ))}
        </div>
      </Async>
      <Button
        asChild
        variant="ghostPrimary"
        className="mt-auto !h-16 w-full !rounded-none border-t hover:!bg-accent/50"
      >
        <Link to={routes.notifications}>View all notifications</Link>
      </Button>
    </Card>
  );
};
