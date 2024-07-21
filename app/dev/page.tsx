//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { getUnauthenticatedOnlyApp } from '@/modules/firebase/guards'

const DashboardPage = async () => {
  const { callables } = await getUnauthenticatedOnlyApp()
  await callables.seedEmulator()

  return <div className="p-5">SEEEDED</div>
}

export default DashboardPage
