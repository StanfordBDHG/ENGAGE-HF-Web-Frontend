//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

export const routes = {
  home: '/',
  notifications: '/notifications',
  users: {
    index: '/users',
    user: (userId: string) => `/users/${userId}`,
    invite: '/users/invite',
  },
  patients: {
    index: '/patients',
    patient: (patientId: string) => `/patients/${patientId}`,
    invite: '/patients/invite',
  },
  signIn: '/sign-in',
}
