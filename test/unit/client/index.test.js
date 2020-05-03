import Index from '../../../pages/index'
import React from 'react'
import { render } from '@testing-library/react'

test('renders login link', () => {
  const { getAllByText } = render(<Index />)
  const linkElements = getAllByText(/Login/)

  linkElements.map(i => {
    expect(i).toBeInTheDocument()
  })
})
