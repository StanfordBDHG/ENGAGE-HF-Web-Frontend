//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { ErrorState } from "@stanfordspezi/spezi-web-design-system/components/ErrorState";
import { InputOTP } from "@stanfordspezi/spezi-web-design-system/components/InputOTP";
import { Spinner } from "@stanfordspezi/spezi-web-design-system/components/Spinner";
import { base64ToBlob } from "@stanfordspezi/spezi-web-design-system/utils/file";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet";
import { AsideEngageLayout } from "@/components/AsideEngageLayout";
import { callables } from "@/modules/firebase/app";

const ViewHealthSummary = () => {
  const { userId, shareCodeId } = Route.useParams();

  const exportHealthSummaryMutation = useMutation({
    mutationFn: callables.exportHealthSummary,
    onSuccess: ({ data }) => {
      const blob = base64ToBlob(data.content, "application/pdf");
      const url = URL.createObjectURL(blob);
      window.location.href = url;
    },
  });

  return (
    <AsideEngageLayout>
      <Helmet>
        <title>View Health Summary</title>
      </Helmet>
      <div className="relative flex flex-col items-center">
        {exportHealthSummaryMutation.isPending && (
          <div className="flex-center absolute left-0 top-0 z-10 size-full bg-surface/60 animate-in fade-in zoom-in">
            <Spinner />
          </div>
        )}
        <h1 className="mb-1 text-center text-2xl font-bold">
          View Health Summary
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Enter one-time code to view the report
        </p>
        <InputOTP
          maxLength={4}
          onComplete={(shareCode: string) =>
            exportHealthSummaryMutation.mutate({
              userId,
              shareCodeId,
              shareCode,
            })
          }
        />
        {exportHealthSummaryMutation.isError && (
          <ErrorState className="mt-8">
            Unable to view report. Your access code may be incorrect or expired.
            <br />
            Please try again.
          </ErrorState>
        )}
      </div>
    </AsideEngageLayout>
  );
};

export const Route = createFileRoute(
  "/patients/$userId/healthSummary/$shareCodeId/",
)({
  component: ViewHealthSummary,
});
