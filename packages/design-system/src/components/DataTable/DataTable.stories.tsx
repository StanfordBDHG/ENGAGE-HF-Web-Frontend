//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type Meta, type StoryObj } from '@storybook/react'
import { DataTable } from './DataTable'
import { peopleColumns, peopleData, type Person } from './DataTable.mocks'
import { Button } from '../Button'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof DataTable<Person>>

export const Default: Story = {
  args: {
    columns: peopleColumns,
    data: peopleData,
    entityName: 'users',
    className: 'm-5',
  },
}

export const Paginated: Story = {
  args: {
    ...Default.args,
    pageSize: 2,
  },
}

export const HeaderAction: Story = {
  args: {
    ...Default.args,
    header: (
      <>
        <Button className="ml-auto" size="sm">
          Action
        </Button>
      </>
    ),
  },
}
