import { type UserMessage } from '@/modules/firebase/models'

export const isMessageRead = (message: UserMessage) => !!message.completionDate

export const filterUnreadNotifications = (messages: UserMessage[]) =>
  messages.filter((notification) => !isMessageRead(notification))

export const parseMessageToLink = (message: UserMessage) => {
  const action = message.action
  if (!action) return null
  const actionParts = action.split('/')
  if (actionParts.at(0) === 'users') {
    // TODO: Support tab navigation
    return `/patients/${actionParts.at(1)}`
  }
  return null
}
