import { EdgeUserProvider } from '../../../lib/client/contexts/edge-user'
import Index from '../../../pages/index'
import React from 'react'
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
      <EdgeUserProvider>
        <Index />
      </EdgeUserProvider>
    )
    const linkElements = getAllByText(/Login/)
  
    linkElements.map((i) => {
      expect(i).toBeInTheDocument()
    })
  })
})
