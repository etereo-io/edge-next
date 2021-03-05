import { PurchashingOptionsType, PurchasingVariantType, ShippingFeeType } from '@lib/types/purchasing'
import React, { useState } from 'react'

import Button from '@components/generic/button/button'
import { COUNTRIES_LIST } from '@lib/constants/countries'
import { CURRENCIES } from '@lib/constants/currencies'
import DynamicFieldEdit from '@components/generic/dynamic-field/dynamic-field-edit'
import { FIELDS } from '@lib/constants'

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

  const onClickRemoveButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    onClickRemove()

  }
  return (
    <>
      <div className="variant-item">

        <div className="input-wr">
          <DynamicFieldEdit
            name="default"
            value={variant.default}
            onChange={(val) => onChange({
              ...variant,
              default: val
            })}
            field={{
              name: 'default',
              type: FIELDS.BOOLEAN,
              label: 'This is the default variant',
            }} />
        </div>

        <div className="input-wr">
          <DynamicFieldEdit
            name="name"
            value={variant.name}
            onChange={(val) => onChange({
              ...variant,
              name: val
            })}
            field={{
              name: 'name',
              type: FIELDS.TEXT,
              placeholder: 'Size M',
              label: 'name',
              min: 0
            }} />
        </div>
        <div className="input-wr">

          <DynamicFieldEdit
            name="stock"
            value={variant.stock}
            onChange={(val) => onChange({
              ...variant,
              stock: val
            })}
            field={{
              name: 'stock',
              type: FIELDS.NUMBER,
              label: 'stock',
              min: 0
            }} />
        </div>

        <div className="input-wr">
          <DynamicFieldEdit
            name="price"
            value={variant.price}
            onChange={(val) => onChange({
              ...variant,
              price: val
            })}
            field={{
              name: 'price',
              type: FIELDS.NUMBER,
              label: 'price',
              placeholder: 0.4,
              min: 0.1,
              max: 10000
            }} />
        </div>
        
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

type PropTypesShippingCountry = {
  shippingFee: ShippingFeeType,
  onChange: (val: ShippingFeeType) => void,
  onClickRemove: () => void
}

function ShippingFeeItem({
  shippingFee,
  onChange,
  onClickRemove
}: PropTypesShippingCountry) {

  const onClickRemoveButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    onClickRemove()
  }

  return (
    <>
      <div className="shipping-fee-item">

        <DynamicFieldEdit
          name="name"
          value={shippingFee.name}
          onChange={(val) => onChange({
            ...shippingFee,
            name: val
          })}
          field={{
            name: 'name',
            type: FIELDS.TEXT,
            placeholder: 'All Countries',
            description: 'Use a descriptive name for the shipping fee. For example: Shipping Fee Spain',
            label: 'Name',
            min: 0
          }} />
        <DynamicFieldEdit
          name="countryCodes"
          value={shippingFee.countryCodes}
          onChange={(val) => onChange({
            ...shippingFee,
            countryCodes: val.map(i => i.value)
          })}
          field={{
            name: 'countryCodes',
            type: FIELDS.ENTITY_SEARCH,
            label: 'Countries',
            multiple: true,
            entities: COUNTRIES_LIST.map(i => {
              return {
                label: i.name,
                value: i.code
              }
            }),
            entityNameGetter: (i) => i.label
          }} />

        <DynamicFieldEdit
          name="price"
          value={shippingFee.price}
          onChange={(val) => onChange({
            ...shippingFee,
            price: val
          })}
          field={{
            name: 'price',
            type: FIELDS.NUMBER,
            label: 'price',
            placeholder: 0.4,
            min: 0,
            max: 10000,
            description: 'Set it to 0 for a FREE shipment'
          }} />

        <Button onClick={onClickRemoveButton}>Remove</Button>
      </div>
      <style jsx>{
        `
        .shipping-fee-item {
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
  const [shippingFees, setShippingFees] = useState([])

  const addVariant = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    ev.stopPropagation()

    const newVariants = [...variants, {
      name: '',
      price: 0.0,
      stock: 0,
      default: false
    }]

    setVariants(newVariants)

    onChange({
      ...value,
      variants: newVariants
    })
  }

  const onChangeVariant = (index, variant: PurchasingVariantType) => {
    const newVariants = variants.map((item, i) => {
      return index === i ? {
        ...variant
      } : {
          ...item,
          default: variant.default === true ? false : item.default
        }
    })
    setVariants(newVariants)

    onChange({
      ...value,
      variants: newVariants
    })
    
  }

  const onRemoveVariant = (index) => {
    const newVariants = variants.filter((item, i) => {
      return i !== index
    })

    setVariants(newVariants)

    onChange({
      ...value,
      variants: newVariants
    })
  }


  const addShippingFee = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    ev.stopPropagation()

    const newShippingFees = [...shippingFees, {
      name: '',
      price: 0.0,
      countryCodes: []
    }]

    setShippingFees(newShippingFees)
    onChange({
      ...value,
      shippingFees: newShippingFees
    })
  }


  const onChangeShippingFee = (index, shippingFee: ShippingFeeType) => {
    const newShippingFees = shippingFees.map((item, i) => {
      return index === i ? {
        ...shippingFee
      } : {
          ...item
        }
    })
    
    setShippingFees(newShippingFees)

    onChange({
      ...value,
      shippingFees: newShippingFees
    })
  }

  const onRemoveShippingFee = (index) => {
    const newShippingFees = shippingFees.filter((item, i) => {
      return i !== index
    })
    
    setShippingFees(newShippingFees)
    onChange({
      ...value,
      shippingFees: newShippingFees
    })
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
            type: FIELDS.BOOLEAN,
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
            type: FIELDS.TEXT,
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
                  value: CURRENCIES.EUR,
                  label: '€'
                }, {
                  value: CURRENCIES.USD,
                  label: '$'
                }, {
                  value: CURRENCIES.GBP,
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

        <div className="divider"></div>
        <h4>Shipping Fees</h4>
        <p>You can specify what countries you will ship too and the prices.</p>
        {shippingFees.map((item, index) => {
          return <div className="shipping-fee" key={`shipping-fee-${index}`}>
            <ShippingFeeItem shippingFee={item} onChange={(val) => onChangeShippingFee(index, val)} onClickRemove={() => onRemoveShippingFee(index)} />
          </div>
        })}
        <Button onClick={addShippingFee}>Add shipping fee</Button>


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