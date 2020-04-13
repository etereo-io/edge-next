import React from 'react'
import { render } from '@testing-library/react'
import Index from '../../../components/header/header'

describe('header test suite', () => {
  test('renders login link in header', () => {
    const { getByText } = render(<Index />)
    const linkElement = getByText(/Login/)
    expect(linkElement).toBeInTheDocument()
  })

})
