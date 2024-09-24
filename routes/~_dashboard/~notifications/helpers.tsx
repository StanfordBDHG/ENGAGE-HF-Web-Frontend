import { createColumnHelper } from '@tanstack/table-core'
import { UserMessage } from '@/modules/firebase/models'

export const columnHelper = createColumnHelper<UserMessage>()

export const columnIds = {
  isRead: 'isRead',
}
