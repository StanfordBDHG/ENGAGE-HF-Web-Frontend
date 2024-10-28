//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import {
  Card,
  CardHeader,
  CardTitle,
} from '@stanfordspezi/spezi-web-design-system/components/Card'
import { formatNilDateTime } from '@stanfordspezi/spezi-web-design-system/utils/date'
import { Clock, FileQuestion, Mail } from 'lucide-react'
import { type ReactNode } from 'react'
import { type UserActivity as UserActivityType } from '@/routes/~_dashboard/~patients/utils'

interface ActivityRowProps {
  icon?: ReactNode
  label?: ReactNode
  value?: ReactNode
}

export const ActivityRow = ({ icon, label, value }: ActivityRowProps) => (
  <li className="flex items-center gap-4">
    <div className="flex-center text-muted-foreground">{icon}</div>
    <div className="flex flex-col gap-1 text-sm">
      <p className="font-medium leading-none">{label}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  </li>
)

interface UserActivityProps {
  activity: UserActivityType
}

export const UserActivity = ({ activity }: UserActivityProps) => (
  <Card className="xl:min-w-max xl:self-start">
    <CardHeader>
      <CardTitle>User activity</CardTitle>
    </CardHeader>
    <div className="px-5 pb-4 marker:text-primary">
      <ul className="flex list-disc flex-col gap-4">
        {activity.isInvitation && (
          <ActivityRow
            icon={<Mail className="size-5" />}
            label="Invitation"
            value="patient has not yet logged in"
          />
        )}
        <ActivityRow
          icon={<Clock className="size-5" />}
          label="Latest activity"
          value={formatNilDateTime(activity.lastActiveDate) ?? 'no activity'}
        />
        <ActivityRow
          icon={<FileQuestion className="size-5" />}
          label="Latest questionnaire answer"
          value={
            formatNilDateTime(activity.latestQuestionnaireDate) ??
            'no questionnaire answered'
          }
        />
      </ul>
    </div>
  </Card>
)
