//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { PageTitle } from "@stanfordspezi/spezi-web-design-system/molecules/DashboardLayout";
import { createFileRoute } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { Helmet } from "react-helmet";
import { YourPatientsCard } from "@/routes/~_dashboard/YourPatientsCard";
import { DashboardLayout } from "./DashboardLayout";
import { NotificationsCard } from "./NotificationsCard";
import { UpcomingAppointmentsCard } from "./UpcomingAppointmentsCard";

const DashboardPage = () => (
  <DashboardLayout title={<PageTitle title="Home" icon={<Home />} />}>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <div className="grid gap-5 xl:grid-cols-2">
      <NotificationsCard />
      <UpcomingAppointmentsCard />
      <YourPatientsCard />
    </div>
  </DashboardLayout>
);

export const Route = createFileRoute("/_dashboard/")({
  component: DashboardPage,
});
