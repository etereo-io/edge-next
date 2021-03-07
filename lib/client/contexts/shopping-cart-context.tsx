import React, { createContext, useContext, useEffect, useState } from 'react'
import { ShoppingCartProductType, ShoppingCartType } from '@lib/types'

import Button from '@components/generic/button/button'
import { UserContext } from './user-context'
import { useTranslation } from 'react-i18next'

export const ShoppingCartContext = createContext<{
  shoppingCart: ShoppingCartType | null,
  addProduct: (i: ShoppingCartProductType) => void,
  removeProduct: (productId: string) => void,
  openShoppingCart: () => void
}>({
  shoppingCart: null,
  addProduct: (i) => null,
  removeProduct: (i) => null,
  openShoppingCart: () => null
})

export const ShoopingCartProvider = ({ children }: any) => {
  const [shoppingCartOpened, setShoppingCartOpened] = useState(false)

  const [shoppingCart, setShoppingCart] = useState<ShoppingCartType>({
    userId: '',
    products: [],
    createdAt: 0,
  })

  const { user } = useContext(UserContext)

  const addProduct = (prodcut: ShoppingCartProductType) => {
    // TODO
  }

  const removeProduct = (productId: string) => {
    // TODO
  }

  const updateProduct = (productId: string, product: ShoppingCartProductType) => {
    // TODO
  }

  // TODO Load Shopping cart from API

  // TODO Sync shopping cart with API

  const { t } = useTranslation()
  
  return (
    <ShoppingCartContext.Provider value={{
      shoppingCart, addProduct, removeProduct, openShoppingCart: () => {
        setShoppingCartOpened(true)
      }
    }}>
      {children}
      {shoppingCartOpened && <>
        <div className="shopping-cart-layer">
          <div className="shopping-cart-layer-top">
            <div className="shopping-cart-layer-top-title">
              <h1>Shopping Cart</h1>
            </div>
            <div className="shopping-cart-layer-top-actions">
              <Button title={t('purchasing.shoppingCart.close')}
               onClick={() => setShoppingCartOpened(false)}><i className="las la-times"></i></Button>
            </div>
          </div>

          {JSON.stringify(shoppingCart, null, 2)}
        </div>
        <style jsx>{
          `
        .shopping-cart-layer {
          position: fixed;
          right: 0;
          top: 0;
          width: 50%;
          background: var(--edge-background);
          height: 100vh;
          z-index: 1000;
          padding: var(--edge-gap);
          transition: all 300ms linear;
          
        }
        `
        }</style>
      </>}
    </ShoppingCartContext.Provider>
  )
}
