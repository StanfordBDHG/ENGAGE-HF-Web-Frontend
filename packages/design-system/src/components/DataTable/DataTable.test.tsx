//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { peopleColumns, peopleData } from './DataTable.mocks'
import { DataTable } from '.'

describe('DataTable', () => {
  it('renders table element with respective columns', () => {
    render(<DataTable columns={peopleColumns} data={peopleData} />)

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    const nameHead = screen.getByRole('columnheader', { name: 'Name' })
    expect(nameHead).toBeInTheDocument()

    const johnCell = screen.getByRole('cell', { name: 'John' })
    expect(johnCell).toBeInTheDocument()
  })
})
