import { fireEvent, render } from '@testing-library/react'

import DynamicField from '../../../../components/generic/dynamic-field/dynamic-field'
import React from 'react'

describe('dynamic field test suite', () => {

  test('Renders the right field', () => {
    const fields = [{
      label: 'The label',
      name: 'text',
      type: 'text'
    }, {
      label: 'The label',
      name: 'textarea',
      type: 'textarea'
    },{
      label: 'The label',
      name: 'number',
      type: 'number'
    },{
      label: 'The label',
      name: 'select',
      type: 'select',
      options: []
    },{
      label: 'The label',
      name: 'radio',
      type: 'radio',
      options: []
    },{
      label: 'The label',
      name: 'file',
      type: 'file'
    },{
      label: 'The label',
      name: 'img',
      type: 'img'
    },{
      label: 'The label',
      name: 'boolean',
      type: 'boolean'
    },{
      label: 'The label',
      name: 'tags',
      type: 'tags'
    }]

    fields.forEach(f => {
      const { getByTestId } = render(<DynamicField field={f} onChange={()=>{}} value={null} />)

      const testElement = getByTestId(`${f.type}-${f.name}`)
      expect(testElement).toBeInTheDocument()
    })
    

  })

  describe('Text field', () => {
    
    test('renders a input text', () => {
      const fieldDefinition = {
        label: 'The label',
        name: 'name',
        type: 'text',
        minlength: 10
      }
      const { getByText, getByTestId } = render(<DynamicField field={fieldDefinition} onChange={()=>{}} value={null} />)
      const labelElement = getByText(/The label/)
      expect(labelElement).toBeInTheDocument()
  
      const testElement = getByTestId('text-name')
      expect(testElement).toBeInTheDocument()

      
      fireEvent.change(testElement, { target: { value: 'short'}})
    })
  })
})

// TODO: Test that errors are shown