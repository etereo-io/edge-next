import { PurchashingOptionsType } from '@lib/types/purchasing'
import React from 'react'

type PropTypes = {
  options: PurchashingOptionsType,
  amount: number,
  selectedVariant?: string
}

export default function ProductPrice({
  options,
  amount,
  selectedVariant
}: PropTypes) {

  const variant = selectedVariant ? options.variants.find(i => i.name === name) : null

  const totalPrice = variant ? variant.price * amount : options.price * amount
  const currency = '€'
  return (
    <>
      <div className="product-price">
        {totalPrice}{currency}
      </div>
      <style jsx>{
        `
        .product-price {
          font-weight: bold;
          
        }
        `
      }</style>
    </>
  )
}