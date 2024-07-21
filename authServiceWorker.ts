//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope

import {
  getFirebaseConfig,
  handleFetchEvent,
  type Config,
} from '@stanfordbdhg/design-system/modules/auth/serviceWorker'

let firebaseConfig: Config

self.addEventListener('install', () => {
  firebaseConfig = getFirebaseConfig()
})

self.addEventListener('fetch', (event) =>
  handleFetchEvent(firebaseConfig, event),
)
