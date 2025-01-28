//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { PageTitle } from "@stanfordspezi/spezi-web-design-system/molecules/DashboardLayout";
import {
  NotFound as NotFoundBase,
  type NotFoundProps,
} from "@stanfordspezi/spezi-web-design-system/molecules/NotFound";
import { useQuery } from "@tanstack/react-query";
import { RouteOff } from "lucide-react";
import { currentUserQueryOptions } from "@/modules/firebase/UserProvider";
import { DashboardLayout } from "@/routes/~_dashboard/DashboardLayout";

/**
 * NotFound component wrapped with DashboardLayout if user is signed in
 * */
export const NotFound = (props: NotFoundProps) => {
  const userQuery = useQuery(currentUserQueryOptions());

  const notFound = <NotFoundBase {...props} />;

  return userQuery.data ?
      <DashboardLayout
        title={<PageTitle title="Not Found" icon={<RouteOff />} />}
      >
        {notFound}
      </DashboardLayout>
    : <div className="flex-center min-h-screen">{notFound}</div>;
};
