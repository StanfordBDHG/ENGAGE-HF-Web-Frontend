import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PageTitle, DashboardLayout, MenuItem } from '.'

describe('DashboardLayout', () => {
  it('renders functional dashboard', () => {
    const menuLinks = <MenuItem href="/home" label="Home" isActive />
    render(
      <DashboardLayout
        aside={menuLinks}
        mobile={menuLinks}
        title={<PageTitle title="Home" />}
      >
        Content
      </DashboardLayout>,
    )

    const dashboardContent = screen.getByText('Content')
    expect(dashboardContent).toBeInTheDocument()

    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toBeInTheDocument()

    const mobileMenu = screen.getByTestId('mobileMenu')
    expect(mobileMenu).not.toBeVisible()

    const menuTriggerButton = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(menuTriggerButton)

    expect(mobileMenu).toBeVisible()
    // Renders both home links - mobile and desktop
    const homeLinks = screen.getAllByRole('link', { name: 'Home' })
    expect(homeLinks).toHaveLength(2)
  })
})
