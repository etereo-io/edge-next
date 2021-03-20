import Index from '../../../pages/index'
import React from 'react'
import { UserProvider } from '../../../lib/client/contexts/edge-user'
import { render } from '@testing-library/react'

describe('Home page', () => {
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
  test('renders login link', () => {
    const { getAllByText } = render(
      <UserProvider>
        <Index />
      </UserProvider>
    )
    const linkElements = getAllByText(/Login/)
  
    linkElements.map((i) => {
      expect(i).toBeInTheDocument()
    })
  })
})
