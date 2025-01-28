//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { queryClient } from "@/modules/query/queryClient";

interface ReactQueryClientProviderProps {
  children: ReactNode;
}

export const ReactQueryClientProvider = ({
  children,
}: ReactQueryClientProviderProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
