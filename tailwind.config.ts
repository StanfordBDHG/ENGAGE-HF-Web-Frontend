//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import tailwindCssAnimate from 'tailwindcss-animate'
import { tailwindColors } from './packages/design-system/src/utils/tailwind'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './{app,pages,components,routes,packages/design-system/src,modules}/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: tailwindColors,
    },
  },
  plugins: [tailwindCssAnimate],
}
