import { EdgeUserProvider } from '../../../lib/client/contexts/edge-user'
import Index from '../../../pages/index'
import React from 'react'
import { render } from '@testing-library/react'

test('renders login link', () => {
  const { getAllByText } = render(
  <EdgeUserProvider><Index /></EdgeUserProvider>)
  const linkElements = getAllByText(/Login/)

  linkElements.map((i) => {
    expect(i).toBeInTheDocument()
  })
})
