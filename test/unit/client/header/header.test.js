import { EdgeUserProvider } from '../../../../lib/client/contexts/edge-user'
import Index from '../../../../components/layout/header/header'
import React from 'react'
import { render } from '@testing-library/react'

describe('header test suite', () => {
  test('renders login link in header', () => {
    const { getByText } = render(<EdgeUserProvider><Index /></EdgeUserProvider>)
    const linkElement = getByText(/Login/)
    expect(linkElement).toBeInTheDocument()
  })
})
