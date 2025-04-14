//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { Button } from "@stanfordspezi/spezi-web-design-system/components/Button";
import {
  Notification as NotificationBase,
  NotificationActions,
  NotificationContentContainer,
  NotificationHeader,
  NotificationImage,
  NotificationLink,
  NotificationMessage,
  NotificationTime,
  NotificationTitle,
} from "@stanfordspezi/spezi-web-design-system/molecules/Notifications";
import { useMutation } from "@tanstack/react-query";
import { callables } from "@/modules/firebase/app";
import {
  parseLocalizedText,
  parseNilLocalizedText,
} from "@/modules/firebase/localizedText";
import { type UserMessage } from "@/modules/firebase/models";
import { useUser } from "@/modules/firebase/UserProvider";
import {
  isMessageRead,
  parseMessageToLink,
} from "@/modules/notifications/helpers";
import { useNotificationActions } from "@/modules/notifications/queries";

interface NotificationProps {
  notification: UserMessage;
}

export const Notification = ({ notification }: NotificationProps) => {
  const { auth } = useUser();
  const { invalidateUserNotifications } = useNotificationActions();
  const markNotificationAsRead = useMutation({
    mutationFn: () =>
      callables.dismissMessage({
        userId: auth.uid,
        messageId: notification.id,
      }),
    onSuccess: invalidateUserNotifications,
  });

  const isRead = isMessageRead(notification);
  const link = parseMessageToLink(notification);

  const content = (
    <>
      <NotificationImage src={null} />
      <NotificationContentContainer>
        <NotificationHeader>
          <NotificationTitle>
            {parseLocalizedText(notification.title)}
          </NotificationTitle>
          <NotificationTime time={new Date(notification.creationDate)} />
        </NotificationHeader>
        <NotificationMessage>
          {parseNilLocalizedText(notification.description)}
        </NotificationMessage>
        <NotificationActions>
          {notification.isDismissible && !isRead && (
            <Button
              variant="link"
              size="xs"
              className="pl-0!"
              onClick={() => markNotificationAsRead.mutate()}
            >
              Mark as read
            </Button>
          )}
        </NotificationActions>
      </NotificationContentContainer>
    </>
  );

  const notificationContext = { isRead };

  return link ?
      <NotificationLink href={link} notification={notificationContext}>
        {content}
      </NotificationLink>
    : <NotificationBase notification={notificationContext}>
        {content}
      </NotificationBase>;
};
