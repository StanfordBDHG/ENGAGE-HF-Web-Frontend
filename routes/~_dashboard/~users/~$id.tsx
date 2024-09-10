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
import { queryClient } from '@/app/ReactQueryClientProvider'
import { callables, docRefs, ensureType } from '@/modules/firebase/app'
import { getDocDataOrThrow } from '@/modules/firebase/utils'
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
      invitationCode: form.invitationCode,
      organization: form.organizationId,
      type: form.type,
      dateOfBirth: form.dateOfBirth?.toISOString(),
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

  return (
    <DashboardLayout
      title={
        <PageTitle
          title="Edit user"
          subTitle={getUserName(authUser)}
          icon={<Users />}
        />
      }
    >
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
    if (!user || !authUser || user.type === UserType.patient) {
      throw notFound()
    }

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
