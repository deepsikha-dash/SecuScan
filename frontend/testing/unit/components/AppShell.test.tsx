import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

let pathname = '/'

vi.mock('react-router-dom', () => ({
  NavLink: ({ children, to }: any) => (
    <a href={to}>{children}</a>
  ),
  useLocation: () => ({
    pathname,
  }),
}))

vi.mock('../../../src/components/Sidebar', () => ({
  default: () => <div data-testid="sidebar" />,
}))

vi.mock('../../../src/components/Background', () => ({
  default: () => <div data-testid="background" />,
}))

vi.mock('../../../src/hooks/useShortcuts', () => ({
  useShortcuts: vi.fn(),
}))

import AppShell from '../../../src/components/AppShell'

describe('AppShell', () => {
  beforeEach(() => {
    pathname = '/'
    localStorage.clear()
  })

  it('renders children content', () => {
    render(
      <AppShell>
        <div>Test Content</div>
      </AppShell>
    )

    expect(screen.getByText('Test Content')).toBeTruthy()
  })

  it('opens and closes mobile drawer from menu button', () => {
    render(
      <AppShell>
        <div>Content</div>
      </AppShell>
    )

    const button = screen.getByLabelText(/toggle navigation menu/i)

    fireEvent.click(button)

    expect(screen.getByText('Settings')).toBeTruthy()

    fireEvent.click(button)

    expect(screen.queryByText('Settings')).toBeNull()
  })

  it('renders bottom navigation items', () => {
    render(
      <AppShell>
        <div>Content</div>
      </AppShell>
    )

    expect(screen.getByText('Dashboard')).toBeTruthy()
    expect(screen.getByText('Scans')).toBeTruthy()
    expect(screen.getByText('Findings')).toBeTruthy()
    expect(screen.getByText('Reports')).toBeTruthy()
    expect(screen.getByText('Workflows')).toBeTruthy()
  })

  it('renders drawer navigation items when menu is opened', () => {
    render(
      <AppShell>
        <div>Content</div>
      </AppShell>
    )

    fireEvent.click(
      screen.getByLabelText(/toggle navigation menu/i)
    )

    expect(screen.getByText('Settings')).toBeTruthy()
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)
  })

  it('closes mobile drawer when route changes', () => {
    const { rerender } = render(
      <AppShell>
        <div>Content</div>
      </AppShell>
    )

    fireEvent.click(
      screen.getByLabelText(/toggle navigation menu/i)
    )

    expect(screen.getByText('Settings')).toBeTruthy()

    pathname = '/reports'

    rerender(
      <AppShell>
        <div>Content</div>
      </AppShell>
    )

    expect(screen.queryByText('Settings')).toBeNull()
  })
})