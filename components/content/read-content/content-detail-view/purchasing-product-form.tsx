import { PurchashingOptionsType, PurchasingVariantType } from '@lib/types/purchasing'
import React, { useEffect, useState } from 'react'

import Button from '@components/generic/button/button'
import DynamicFieldEdit from '@components/generic/dynamic-field/dynamic-field-edit'

type PropTypes = {
  value: PurchashingOptionsType,
  onChange: (val: PurchashingOptionsType) => void
}


export default function PurchasingProductForm({
  value,
  onChange
}: PropTypes) {
  const [variants, setVariants] = useState([])

  const [selectedVariant, setSelectedVariant] = useState('')
  const [amount, setAmount] = useState(1)

  useEffect(() => {
    setSelectedVariant(value.options.find(i => i.default).name)
  }, [value])

  const variant = selectedVariant ? value.options.find(i => i.name === name): null

  const totalPrice = variant ? variant.price * amount : value.price * amount
  const currency = '€'

  const addToCart = () => {

  }

  return (
    <>
      <div className="purchasing-product-form">
        <h3>Purchase item</h3>
        <div className="variant-selector">
          <DynamicFieldEdit
            name="variant"
            value={selectedVariant}
            onChange={(val) => setSelectedVariant(name)}
            field={{
              name: 'Type',
              type: 'select',
              label: 'Type',
              options: value.options.map(i => {
                return {
                  label: i.name,
                  value: i.name
                }
              })
            }} />

          <DynamicFieldEdit
            name="amount"
            value={amount}
            onChange={(val) => setAmount(val)}
            field={{
              name: 'Amount',
              type: 'number',
              label: 'Amount',
              min: 1,
              max: 10000
            }} />
        </div>
        <div className="price">
          {totalPrice} {currency}
        </div>

        
        <Button onClick={addToCart}>Add to cart</Button>
      </div>
      <style jsx>{
        `
        .purchasing-options {
          padding: var(--edge-gap);
          border: 1px solid;
          
        }

        .form-row {
          display: flex;
        }

        .form-row .input-wr {
          width: 50%;
        }
        `
      }</style>
    </>
  )
}