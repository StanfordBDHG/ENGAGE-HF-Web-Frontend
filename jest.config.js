//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  collectCoverage: true,
  modulePathIgnorePatterns: ['dist'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
  collectCoverageFrom: [
    '**/*.ts',
    '**/*.tsx',
    '!**/build/**',
    '!**/node_modules/**',
    '!**/.storybook/**',
    '!**/tailwind.config.ts',
    '!**/*.stories.tsx',
  ],
}
