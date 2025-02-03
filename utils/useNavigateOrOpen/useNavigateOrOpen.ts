//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { useNavigate } from "@tanstack/react-router";

/**
 * This hook tries to replicate native CMD+Click on links to open them in a new tab
 * Use only when no regular link can be used (for example on DataTable row click)
 * */
export const useNavigateOrOpen = () => {
  const navigate = useNavigate();
  return async (
    event: { ctrlKey: boolean; metaKey: boolean },
    ...args: Parameters<typeof navigate>
  ) => {
    const [path] = args;
    if (event.ctrlKey || event.metaKey) {
      window.open(path.to, "_blank");
    } else {
      await navigate(...args);
    }
  };
};
