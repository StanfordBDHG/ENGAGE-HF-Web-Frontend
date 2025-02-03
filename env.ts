//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const booleanFlag = z
  .preprocess((value) => {
    if (typeof value === "string") {
      const flag = value.trim().toLowerCase();
      return flag === "true" || flag === "1" || flag === "t";
    }
    return value;
  }, z.boolean().optional())
  .default(false);

export const env = createEnv({
  server: {},
  client: {
    VITE_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
    VITE_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
    VITE_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
    VITE_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
    VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
    VITE_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
    VITE_PUBLIC_EMULATOR: booleanFlag,
    VITE_PUBLIC_EMAIL_PASSWORD_SIGN_IN: booleanFlag,
  },
  clientPrefix: "VITE_PUBLIC",
  runtimeEnv: {
    VITE_PUBLIC_FIREBASE_API_KEY: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
    VITE_PUBLIC_FIREBASE_AUTH_DOMAIN: import.meta.env
      .VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
    VITE_PUBLIC_FIREBASE_PROJECT_ID: import.meta.env
      .VITE_PUBLIC_FIREBASE_PROJECT_ID,
    VITE_PUBLIC_FIREBASE_STORAGE_BUCKET: import.meta.env
      .VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
    VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: import.meta.env
      .VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    VITE_PUBLIC_FIREBASE_APP_ID: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID,
    VITE_PUBLIC_EMULATOR: import.meta.env.VITE_PUBLIC_EMULATOR,
    VITE_PUBLIC_EMAIL_PASSWORD_SIGN_IN: import.meta.env
      .VITE_PUBLIC_EMAIL_PASSWORD_SIGN_IN,
  },
});
