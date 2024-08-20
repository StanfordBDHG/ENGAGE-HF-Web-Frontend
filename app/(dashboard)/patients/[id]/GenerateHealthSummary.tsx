//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { kebabCase } from 'es-toolkit'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { callables } from '@/modules/firebase/clientApp'
import { type ResourceType } from '@/modules/firebase/utils'
import { Button } from '@/packages/design-system/src/components/Button'
import { toast } from '@/packages/design-system/src/components/Toaster'
import { Tooltip } from '@/packages/design-system/src/components/Tooltip'
import {
  base64ToBlob,
  downloadFile,
} from '@/packages/design-system/src/utils/file'

interface GenerateHealthSummaryProps {
  userId: string
  userName: string
  resourceType: ResourceType
}

export const GenerateHealthSummary = ({
  userId,
  resourceType,
  userName,
}: GenerateHealthSummaryProps) => {
  const [isPending, setIsPending] = useState(false)

  const downloadHealthSummary = async () => {
    setIsPending(true)
    try {
      const exportHealthPromise = callables.exportHealthSummary({ userId })
      toast.promise(exportHealthPromise, {
        loading: `Generating health summary for ${userName}...`,
        success: `Health summary for ${userName} has been downloaded.`,
        error: `Generating health summary for ${userName} failed. Please try later.`,
      })
      const response = await exportHealthPromise
      const blob = base64ToBlob(response.data.content, 'application/pdf')
      downloadFile(blob, `health-summary-${kebabCase(userName)}.pdf`)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Tooltip
      open={resourceType === 'invitation' ? undefined : false}
      tooltip="This user has not logged in to the application yet"
    >
      <Button
        type="submit"
        disabled={resourceType === 'invitation'}
        onClick={downloadHealthSummary}
        className="disabled:pointer-events-auto"
        isPending={isPending}
      >
        <Download />
        Export Health Summary
      </Button>
    </Tooltip>
  )
}