//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type Meta } from '@storybook/react'
import { DataTable } from './DataTable'
import { peopleColumns, peopleData } from './DataTable.mocks'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const Default = () => (
  <DataTable columns={peopleColumns} data={peopleData} className="m-5" />
)
