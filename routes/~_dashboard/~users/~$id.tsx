//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { updateDoc } from '@firebase/firestore'
import { UserType } from '@stanfordbdhg/engagehf-models'
import { createFileRoute, notFound, useRouter } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { Helmet } from 'react-helmet'
import { callables, docRefs, ensureType } from '@/modules/firebase/app'
import { getDocDataOrThrow } from '@/modules/firebase/utils'
import { queryClient } from '@/modules/query/queryClient'
import {
  getUserData,
  userOrganizationQueryOptions,
} from '@/modules/user/queries'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import {
  UserForm,
  type UserFormSchema,
} from '@/routes/~_dashboard/~users/UserForm'
import { DashboardLayout } from '../DashboardLayout'

const UserPage = () => {
  const router = useRouter()
  const { id: userId } = Route.useParams()
  const { authUser, user, resourceType, organizations } = Route.useLoaderData()

  const updateUser = async (form: UserFormSchema) => {
    const authData = {
      displayName: form.displayName,
      email: form.email,
    }
    const userData = {
      organization: form.organizationId,
      type: form.type,
    }
    if (resourceType === 'user') {
      await callables.updateUserInformation({
        userId,
        data: {
          auth: authData,
        },
      })
      await updateDoc(docRefs.user(userId), userData)
    } else {
      const invitation = await getDocDataOrThrow(docRefs.invitation(userId))
      await updateDoc(docRefs.invitation(userId), {
        auth: {
          ...invitation.auth,
          ...authData,
        },
        user: {
          ...invitation.user,
          ...userData,
        },
      })
    }
    await router.invalidate()
  }

  const userName = getUserName(authUser)
  return (
    <DashboardLayout
      title={
        <PageTitle title="Edit user" subTitle={userName} icon={<Users />} />
      }
    >
      <Helmet>
        <title>Edit {userName}</title>
      </Helmet>
      <UserForm
        organizations={organizations}
        type={user.type}
        user={user}
        userInfo={authUser}
        onSubmit={updateUser}
      />
    </DashboardLayout>
  )
}

export const Route = createFileRoute('/_dashboard/users/$id')({
  component: UserPage,
  beforeLoad: () => ensureType([UserType.admin, UserType.owner]),
  loader: async ({ params }) => {
    const userId = params.id
    const { resourceType, user, authUser } = await getUserData(userId)
    if (user.type === UserType.patient) throw notFound()

    return {
      user,
      authUser,
      resourceType,
      organizations: await queryClient.ensureQueryData(
        userOrganizationQueryOptions(),
      ),
    }
  },
})
