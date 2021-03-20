import Index from '../../../../components/layout/header/header'
import React from 'react'
import { UserProvider } from '../../../../lib/client/contexts/edge-user'
import { render } from '@testing-library/react'

describe('header test suite', () => {
  beforeAll(() => {
    const observe = jest.fn();
    const unobserve = jest.fn();
    const disconnect = jest.fn();

    // you can also pass the mock implementation
    // to jest.fn as an argument
    window.IntersectionObserver = jest.fn(() => ({
      observe,
      unobserve,
      disconnect
    }))
  })

  test('renders login link in header', () => {
    const { getByText } = render(
      <UserProvider>
        <Index />
      </UserProvider>
    )
    const linkElement = getByText(/Login/)
    expect(linkElement).toBeInTheDocument()
  })
})
