//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import type en from "./modules/messages/translations/en.json";

/// <reference types="vite/client" />

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}

  interface ImportMetaEnv {
    VITE_PUBLIC_FIREBASE_API_KEY: string;
    VITE_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    VITE_PUBLIC_FIREBASE_PROJECT_ID: string;
    VITE_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    VITE_PUBLIC_FIREBASE_APP_ID: string;
    VITE_PUBLIC_EMULATOR: string;
    VITE_PUBLIC_EMAIL_PASSWORD_SIGN_IN: string;
  }
}
