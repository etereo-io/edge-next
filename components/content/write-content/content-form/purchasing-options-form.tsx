import { PurchashingOptionsType, PurchasingVariantType } from '@lib/types/purchasing'
import React, { useState } from 'react'

import Button from '@components/generic/button/button'
import DynamicFieldEdit from '@components/generic/dynamic-field/dynamic-field-edit'

type PropTypesVariantItem = {
  variant: PurchasingVariantType,
  onChange: (val: PurchasingVariantType) => void,
  onClickRemove: () => void
}

function VariantItem({
  variant,
  onChange,
  onClickRemove
}: PropTypesVariantItem) {

  const onClickRemoveButton = (ev: React.MouseEvent<HTMLButtonElement>)  => {
    ev.preventDefault()
    ev.stopPropagation()
    onClickRemove()

  }
  return (
    <>
      <div className="variant-item">
        <DynamicFieldEdit
          name="default"
          value={variant.default}
          onChange={(val) => onChange({
            ...variant,
            default: val
          })}
          field={{
            name: 'default',
            type: 'boolean',
            label: 'This is the default variant',
          }} />
        <DynamicFieldEdit
          name="name"
          value={variant.name}
          onChange={(val) => onChange({
            ...variant,
            name: val
          })}
          field={{
            name: 'name',
            type: 'text',
            placeholder: 'Size M',
            label: 'name',
            min: 0
          }} />
        <DynamicFieldEdit
          name="stock"
          value={variant.stock}
          onChange={(val) => onChange({
            ...variant,
            stock: val
          })}
          field={{
            name: 'stock',
            type: 'number',
            label: 'stock',
            min: 0
          }} />
        <DynamicFieldEdit
          name="price"
          value={variant.price}
          onChange={(val) => onChange({
            ...variant,
            price: val
          })}
          field={{
            name: 'price',
            type: 'number',
            label: 'price',
            placeholder: 0.4,
            min: 0.1,
            max: 10000
          }} />

          <Button onClick={onClickRemoveButton}>Remove</Button>
      </div>
      <style jsx>{
        `
        .variant-item {
          padding: var(--edge-gap);
          border: 1px solid var(--accents-3);
          margin: var(--edge-gap);
        }
        `
      }</style>
    </>
  )
}


type PropTypes = {
  value: PurchashingOptionsType,
  onChange: (val: PurchashingOptionsType) => void
}


export default function PurchasingOptionsForm({
  value,
  onChange
}: PropTypes) {
  const [variants, setVariants] = useState([])

  const addVariant = (ev: React.MouseEvent<HTMLButtonElement>)  => {
    ev.preventDefault()
    ev.stopPropagation()

    setVariants([...variants, {
      name: '',
      price: 0.0,
      stock: 0,
      default: false
    }])
  }

  const onChangeVariant = (index, value: OptionsType) => {
    setVariants(variants.map((item, i) => {
      return index === i ? {
        ...value
      } : {
          ...item,
          default: value.default === true ? false: item.default
        }
    }))
  }

  const onRemoveVariant = (index) => {
    setVariants(variants.filter((item, i) => {
      return i !== index
    }))
  }

  return (
    <>
      <div className="purchasing-options">
        <h3>Purchashing Options</h3>
        <DynamicFieldEdit
          name="multiple"
          value={value.multiple}
          onChange={(val) => onChange({
            ...value,
            multiple: val
          })}
          field={{
            name: 'multiple',
            type: 'boolean',
            label: 'Allow multiple items',
          }} />
        <DynamicFieldEdit
          name="sku"
          value={value.sku}
          onChange={(val) => onChange({
            ...value,
            sku: val
          })}
          field={{
            name: 'sku',
            type: 'text',
            label: 'SKU',
          }} />
        <DynamicFieldEdit
          name="stock"
          value={value.stock}
          onChange={(val) => onChange({
            ...value,
            stock: val
          })}
          field={{
            name: 'stock',
            type: 'number',
            label: 'stock',
            min: 0
          }} />

        <div className="form-row">
          <div className="input-wr">
            <DynamicFieldEdit
              name="price"
              value={value.price}
              onChange={(val) => onChange({
                ...value,
                price: val
              })}
              field={{
                name: 'price',
                type: 'number',
                label: 'price',
                min: 0.1,
                max: 10000
              }} />
          </div>
          <div className="input-wr">
            <DynamicFieldEdit
              name="currency"
              value={value.currency}
              onChange={(val) => onChange({
                ...value,
                currency: val
              })}
              field={{
                name: 'currency',
                type: 'select',
                label: 'Currency',
                options: [{
                  value: 'euro',
                  label: '€'
                }, {
                  value: 'dollar',
                  label: '$'
                }, {
                  value: 'pound',
                  label: '£'
                }],
                description: 'Note: All values will be transformed to dollars at the moment of the payment.'
              }} />
          </div>
        </div>

        <div className="divider"></div>
        <h4>Product Variants</h4>
        <p>You can add diferent options for this product. For example: Sizes S,X,M,L with different prices and stock.</p>
        {variants.map((item, index) => {
          return <div className="variant" key={`variant-${index}`}>
            <VariantItem variant={item} onChange={(val) => onChangeVariant(index, val)} onClickRemove={() => onRemoveVariant(index)} />
          </div>
        })}
        <Button onClick={addVariant}>Add variant</Button>
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