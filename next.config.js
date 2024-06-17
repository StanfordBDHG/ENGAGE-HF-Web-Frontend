//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./modules/messages/i18n.ts')

const output = process.env.NEXT_JS_OUTPUT || 'standalone'
const imagesUnoptimized = process.env.NEXT_JS_IMAGES_UNOPTIMIZED == 'true'
const basePath = process.env.NEXT_JS_BASE_PATH ?? ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: output,
  images: {
    unoptimized: imagesUnoptimized,
  },
  basePath: basePath,
  env: {
    basePath: basePath,
  },
}

module.exports = withNextIntl(nextConfig)
