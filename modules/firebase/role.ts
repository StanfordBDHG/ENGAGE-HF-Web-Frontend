//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { upperFirst } from '@/packages/design-system/src/utils/misc'

export enum Role {
  admin = 'admin',
  owner = 'owner', // owner of organization
  clinician = 'clinician',
  user = 'user', // patient
}

export const stringifyRole = (role: Role) => upperFirst(role)
