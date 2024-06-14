//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { getServerApp as getServerAppBase } from '@stanfordbdhg/design-system/modules/auth/serverApp'
import { firebaseConfig } from './config'

export const getServerApp = () => getServerAppBase(firebaseConfig)
