//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { type ResourceType } from "@/modules/firebase/utils";
import type { PatientPageTab } from "@/routes/~_dashboard/~patients/~$id/~index";

export const routes = {
  home: "/",
  notifications: "/notifications",
  admin: "/admin",
  users: {
    index: "/users",
    user: (userId: string, resourceType: ResourceType) =>
      `/users/${resourceType === "invitation" ? "invitation-" : ""}${userId}`,
    invite: "/users/invite",
  },
  patients: {
    index: "/patients",
    patient: (
      patientId: string,
      resourceType: ResourceType,
      params?: { tab?: PatientPageTab },
    ) =>
      `/patients/${resourceType === "invitation" ? "invitation-" : ""}${patientId}${params?.tab ? `?tab=${params.tab}` : ""}`,
    invite: "/patients/invite",
    viewHealthSummary: (patientId: string, shareCodeId: string) =>
      `/patients/${patientId}/healthSummary/${shareCodeId}`,
  },
  signIn: "/sign-in",
} as const;
