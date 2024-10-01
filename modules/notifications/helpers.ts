import { type UserMessage } from '@/modules/firebase/models'

export const isMessageRead = (message: UserMessage) => !!message.completionDate

export const filterUnreadNotifications = (messages: UserMessage[]) =>
  messages.filter((notification) => !isMessageRead(notification))

export const parseMessageToLink = (message: UserMessage) => {
  const action = message.action
  if (!action) return null
  const actionParts = action.split('/')
  if (actionParts.at(0) === 'users') {
    const userId = actionParts.at(1)
    const tab = actionParts.at(2)
    return `/patients/${userId}${tab ? `?tab=${tab}` : ''}`
  }
  return null
}

export const getNotificationPatientId = (message: UserMessage) => {
  const action = message.action
  if (!action) return null
  const actionParts = action.split('/')
  if (actionParts.at(0) === 'users') {
    return actionParts.at(1)
  }
  return null
}
