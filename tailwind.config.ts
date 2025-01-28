//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { tailwindColors } from "@stanfordspezi/spezi-web-design-system";
import tailwindCssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./{app,pages,components,routes,modules}/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@stanfordspezi/spezi-web-design-system/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: tailwindColors,
    },
  },
  plugins: [tailwindCssAnimate],
};
