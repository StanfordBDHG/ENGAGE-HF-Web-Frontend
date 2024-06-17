//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { SignOutButton } from './SignOutButton'

const DashboardPage = () => (
  <div className="grid gap-6 p-10 text-center">
    <h1 className="text-2xl">Dashboard</h1>
    <SignOutButton />
  </div>
)

export default DashboardPage
