import Layout from '@components/layout/three-panels/layout'
import LoadingPage from '@components/generic/loading/loading-page/loading-page'
import fetch from '@lib/fetcher'
import { purchasingPermission } from '@lib/permissions'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useUser } from '@lib/client/hooks'

const CheckoutPage = () => {
  const router = useRouter()
  const { cartId } = router.query

  // Check permissions to read
  const currentUser = useUser()

  const hasPermissionsToBuy = purchasingPermission(currentUser.user, 'buy')

  // Load shopping cart

  // Load store data
  const { data, error } = useSWR(cartId ? `/api/shopping-carts/${cartId}` : null, fetch)
  

  useEffect(() => {
    if (currentUser && !hasPermissionsToBuy) {
      // Redirect to 404 if the user is not found
      router.push('/404')
    }
  }, [hasPermissionsToBuy, currentUser])

  

  return (
    <Layout title="Checkout" >
      {!hasPermissionsToBuy ? (
        <LoadingPage />
      ) : (
        <div className="checkout-wrapper">
          <div className="checkout-content-wrapper">
            <h2>
              Customer
            </h2>
            <p>Login or use an email</p>

            <h2>Shipping</h2>
            <p>If logged use the shipping adddress otherwise enter new. Use billing address too</p>

            <h2>Payment</h2>
            <p>Credit card form an place order</p>
          </div>
          
          <div className="shopping-cart-wrapper">
            Shopping cart
            { data && JSON.stringify(data)}
          </div>
        </div>
      )}

      <style jsx>
        {`
          .checkout-wrapper {
            background: var(--edge-background);
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            overflow: hidden;
          }
          
        `}
      </style>
    </Layout>
  )
}

export default CheckoutPage
