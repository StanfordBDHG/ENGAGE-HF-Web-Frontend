//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

export const routes = {
  home: '/',
  users: {
    index: '/users',
    user: (userId: string) => `/users/${userId}`,
    create: '/users/create',
  },
  patients: {
    index: '/patients',
  },
  signIn: '/sign-in',
}
