//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { type UserMessage } from "@/modules/firebase/models";
import { routes } from "@/modules/routes";
import { type PatientPageTab } from "@/routes/~_dashboard/~patients/~$id/~index";

export const isMessageRead = (message: UserMessage) => !!message.completionDate;

export const filterUnreadNotifications = (messages: UserMessage[]) =>
  messages.filter((notification) => !isMessageRead(notification));

export const parseMessageToLink = (message: UserMessage) => {
  const action = message.action;
  if (!action) return null;
  const actionParts = action.split("/");
  if (actionParts.at(0) === "users") {
    const userId = actionParts.at(1);
    const tab = actionParts.at(2);
    if (userId) {
      return routes.patients.patient(userId, "user", {
        tab: tab as PatientPageTab,
      });
    }
  }
  return null;
};

export const getNotificationPatientId = (message: UserMessage) => {
  const action = message.action;
  if (!action) return null;
  const actionParts = action.split("/");
  if (actionParts.at(0) === "users") {
    return actionParts.at(1);
  }
  return null;
};
