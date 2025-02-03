//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2025 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { UserType } from "@stanfordbdhg/engagehf-models";
import { Button } from "@stanfordspezi/spezi-web-design-system/components/Button";
import { toast } from "@stanfordspezi/spezi-web-design-system/components/Toaster";
import { PageTitle } from "@stanfordspezi/spezi-web-design-system/molecules/DashboardLayout";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MonitorCog } from "lucide-react";
import { Helmet } from "react-helmet";
import { callables, ensureType } from "@/modules/firebase/app";
import { DashboardLayout } from "../DashboardLayout";

const AdminPage = () => {
  const updateStaticData = useMutation({
    mutationFn: () => callables.updateStaticData({}),
    onSuccess: () => toast.success("Successfully updated static data"),
    onError: () => toast.error("Updating static data failed. Please try again"),
  });

  const seedData = useMutation({
    mutationFn: () => callables.defaultSeed({}),
    onSuccess: () => toast.success("Successfully seeded data"),
    onError: () => toast.error("Seeding data failed. Please try again"),
  });

  return (
    <DashboardLayout title={<PageTitle title="Admin" icon={<MonitorCog />} />}>
      <Helmet>
        <title>Admin</title>
      </Helmet>
      <div className="flex flex-col items-start gap-8">
        <section className="flex flex-col items-start gap-2">
          <Button
            onClick={() => updateStaticData.mutate()}
            isPending={updateStaticData.isPending}
          >
            Update static data
          </Button>
          <p className="text-sm font-light">
            Updates static data, like medications, organizations and video
            sections
          </p>
        </section>
        <section className="flex flex-col items-start gap-2">
          <Button
            onClick={() => seedData.mutate()}
            isPending={seedData.isPending}
          >
            Seed data
          </Button>
          <p className="text-sm font-light">
            Seeds the application with test users
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
};

export const Route = createFileRoute("/_dashboard/admin/")({
  component: AdminPage,
  beforeLoad: () => ensureType([UserType.admin]),
});
