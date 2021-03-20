import { PurchashingOptionsType, PurchasingVariantType } from '@lib/types/purchasing'
import React, { useContext, useEffect, useState } from 'react'

import Button from '@components/generic/button/button'
import DynamicFieldEdit from '@components/generic/dynamic-field/dynamic-field-edit'
import { ShoppingCartContext } from '@lib/client/contexts/shopping-cart-context'
import { useTranslation } from 'react-i18next'

type PropTypes = {
  value: PurchashingOptionsType
}


export default function PurchasingProductForm({
  value
}: PropTypes) {

  const [selectedVariant, setSelectedVariant] = useState('')
  const [amount, setAmount] = useState(1)
  const { addProduct } = useContext(ShoppingCartContext)

  useEffect(() => {
    if (value && value.variants && value.variants.length > 0) {
      const defaultVariant = value.variants.find(i => i.default) || value.variants[0]
      setSelectedVariant(defaultVariant.name)
      
    }
  }, [value])

  const variant = selectedVariant ? value.variants.find(i => i.name === name) : null

  const totalPrice = variant ? variant.price * amount : value.price * amount
  const currency = '€'

  const addToCart = () => {
    addProduct({
      amount,
      productContentType: 'a',
      productId: 'a',
      sellerId: 'a',
      variant: selectedVariant,
    })

  }

  const { t } = useTranslation()

  return (
    <>
      <div className="purchasing-product-form">
        <h3>Purchase item</h3>
        <div className="variant-selector">
          { value.variants && value.variants.length > 0 && <DynamicFieldEdit
            name="variant"
            value={selectedVariant}
            onChange={(val) => setSelectedVariant(name)}
            field={{
              name: 'Type',
              type: 'select',
              label: 'Type',
              options: value.variants.map(i => {
                return {
                  label: i.name,
                  value: i.name
                }
              })
            }} />}

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


        <Button title={t('purchasing.shoppingCart.add')} onClick={addToCart}>{t('purchasing.shoppingCart.add')}</Button>
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