//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { fireEvent, render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { peopleColumns, peopleData } from './DataTable.mocks'
import { DataTable } from '.'

describe('DataTable', () => {
  const getTBody = () => {
    // tBody exists, guaranteed by previous tests
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return screen.getByRole('table').querySelector('tbody')!
  }

  const getRows = () => within(getTBody()).getAllByRole('row')

  const expectNamesInGivenOrder = (data: typeof peopleData) =>
    getRows().forEach((row, index) => {
      const name = data.at(index)?.name
      expect(name).toBeDefined()
      const cellColumn = within(row).getByRole('cell', { name })
      expect(cellColumn).toBeInTheDocument()
    })

  it('renders table element with respective columns', () => {
    render(<DataTable columns={peopleColumns} data={peopleData} />)

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    const nameHead = screen.getByRole('columnheader', { name: 'Name' })
    expect(nameHead).toBeInTheDocument()

    const someCell = screen.getByRole('cell', { name: peopleData.at(0)?.name })
    expect(someCell).toBeInTheDocument()
  })

  it('shows empty state', () => {
    const { rerender } = render(<DataTable columns={peopleColumns} data={[]} />)

    // Regex because text is broken with elements
    const emptyState = screen.getByText(/No\sresults\sfound/)
    expect(emptyState).toBeInTheDocument()

    rerender(<DataTable columns={peopleColumns} data={[]} entityName="users" />)
    const emptyStateWithEntityName = screen.getByText(/No\susers\sfound/)
    expect(emptyStateWithEntityName).toBeInTheDocument()
  })

  it('paginates data', () => {
    render(<DataTable columns={peopleColumns} data={peopleData} pageSize={2} />)

    expect(getRows()).toHaveLength(2)
    const paginationCounter = screen.getByText(`1-2 of ${peopleData.length}`)
    expect(paginationCounter).toBeInTheDocument()

    const pageFour = screen.getByRole('button', { name: '4' })
    fireEvent.click(pageFour)

    expect(getRows()).toHaveLength(1)
    const lastCell = screen.getByRole('cell', { name: peopleData.at(-1)?.name })
    expect(lastCell).toBeInTheDocument()

    const lastPagePaginationCounter = screen.getByText(
      `7-7 of ${peopleData.length}`,
    )
    expect(lastPagePaginationCounter).toBeInTheDocument()
  })

  it('sorts data', () => {
    render(<DataTable columns={peopleColumns} data={peopleData} pageSize={2} />)

    const enableDescSortButton = screen.getByRole('button', {
      name: 'Sort descending by Age column',
    })
    fireEvent.click(enableDescSortButton)
    expectNamesInGivenOrder([...peopleData].sort((a, b) => b.age - a.age))

    const enableAscSortButton = screen.getByRole('button', {
      name: 'Sort ascending by Age column',
    })
    fireEvent.click(enableAscSortButton)
    expectNamesInGivenOrder([...peopleData].sort((a, b) => a.age - b.age))

    const disabledSortButton = screen.getByRole('button', {
      name: 'Disable sorting by Age column',
    })
    fireEvent.click(disabledSortButton)
    // Just order of the data
    expectNamesInGivenOrder(peopleData)
  })

  it('filters data with fuzzy search', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={peopleColumns} data={peopleData} />)

    const searchInput = screen.getByRole('textbox', { name: 'Search...' })
    await user.type(searchInput, '4')

    // search is debounced, wait for it to happen
    await screen.findByText('1-3 of 3')
    expectNamesInGivenOrder(
      peopleData.filter((person) => person.age.toString().includes('4')),
    )

    await user.clear(searchInput)
    await user.type(searchInput, 'lor')

    await screen.findByText('1-1 of 1')
    expectNamesInGivenOrder(
      peopleData.filter((person) => person.name.toLowerCase().includes('lor')),
    )

    await user.clear(searchInput)
    await user.type(searchInput, '1111')

    //
    const emptyState = await screen.findByText(/No results found/)
    expect(emptyState).toBeInTheDocument()
    const searchTextDisplayed = screen.getByText(/"1111"/)
    expect(searchTextDisplayed).toBeInTheDocument()
  })

  it('supports entityName for search', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={peopleColumns}
        data={peopleData}
        entityName="users"
      />,
    )

    const searchInput = screen.getByRole('textbox', { name: 'Search users...' })
    await user.type(searchInput, '44444lorem44444')

    const emptyState = await screen.findByText(/No users found/)
    expect(emptyState).toBeInTheDocument()
  })
})
