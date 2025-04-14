//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { Card } from "@stanfordspezi/spezi-web-design-system/components/Card";
import { formatNilDateTime } from "@stanfordspezi/spezi-web-design-system/utils/date";
import { Clock, FileQuestion, Mail, BookLock, AtSign } from "lucide-react";
import { type ReactNode } from "react";
import { type PatientInfo as PatientInfoData } from "@/routes/~_dashboard/~patients/utils";

interface InfoRowProps {
  icon?: ReactNode;
  label?: ReactNode;
  value?: ReactNode;
}

export const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <li className="flex items-center gap-4">
    <div className="flex-center text-muted-foreground">{icon}</div>
    <div className="flex flex-col gap-1 text-sm">
      <p className="leading-none font-medium">{label}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  </li>
);

interface PatientInfoProps {
  info: PatientInfoData;
}

export const PatientInfo = ({ info }: PatientInfoProps) => (
  <Card className="xl:min-w-max xl:self-start">
    <div className="px-5 py-4">
      <ul className="flex flex-col gap-4">
        <InfoRow
          icon={<AtSign className="size-5" />}
          label="Email"
          value={info.email ?? "no email"}
        />
        <InfoRow
          icon={<BookLock className="size-5" />}
          label="Invitation code"
          value={info.invitationCode}
        />
        {info.isInvitation && (
          <InfoRow
            icon={<Mail className="size-5" />}
            label="Invitation"
            value="patient has not yet logged in"
          />
        )}
        <InfoRow
          icon={<Clock className="size-5" />}
          label="Latest activity"
          value={formatNilDateTime(info.lastActiveDate) ?? "no activity"}
        />
        <InfoRow
          icon={<FileQuestion className="size-5" />}
          label="Latest questionnaire answer"
          value={
            formatNilDateTime(info.latestQuestionnaireDate) ??
            "no questionnaire answered"
          }
        />
      </ul>
    </div>
  </Card>
);
