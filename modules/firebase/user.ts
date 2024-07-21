import {
  getAuthenticatedOnlyApp,
  type UserAuthenticationInformation,
} from '@/modules/firebase/guards'

export const mapUserData = async <T>(
  userIds: string[],
  callback: (userInformation: UserAuthenticationInformation, id: string) => T,
) => {
  const { callables } = await getAuthenticatedOnlyApp()
  // TODO: It can take max 100 users. Batch/paginate? Use getting by id? Fetch all and match?
  const usersRecord = await callables.getUsersInformation({ userIds })
  return userIds
    .map((id) => {
      // authData might be undefined
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const authData = usersRecord.data[id]?.data?.auth
      if (!authData) {
        console.error(`Cannot locate user ${id}.`, {
          userData: usersRecord.data[id],
          id,
        })
        return null
      }
      return callback(authData, id)
    })
    .filter(Boolean)
}
