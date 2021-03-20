import { Tabs, useTab } from '@components/generic/tabs'
import { purchasingPermission, userPermission } from '@lib/permissions'
import { useContentTypes, useGroupTypes, useUser } from '@lib/client/hooks'
import { useEffect, useMemo } from 'react'

import Button from '@components/generic/button/button'
import ContentListView from '@components/content/read-content/content-list-view/content-list-view'
import CoverImage from '@components/user/cover-image/cover-image'
import GroupListView from '@components/groups/read/group-list-view/group-list-view'
import Layout from '@components/layout/three-panels/layout'
import LoadingPage from '@components/generic/loading/loading-page/loading-page'
import ToolBar from '@components/generic/toolbar/toolbar'
import UserActivity from '@components/user/activity/activity'
import UserProfileBox from '@components/user/user-profile-box/user-profile-box'
import config from '@lib/config'
import fetch from '@lib/fetcher'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const ShoppingCart = () => {
  const router = useRouter()
  const { userId } = router.query

  // Check permissions to read
  const currentUser = useUser()

  const hasPermissionsToRead = currentUser.user && currentUser.user.id === userId as string
  const canManageOrders = purchasingPermission(currentUser.user, 'orders')
  const canAccess = hasPermissionsToRead && canManageOrders

  // Load profile data
  const { data, error } = useSWR(userId ? `/api/shopping-carts/${userId}` : null, fetch)

  // Protect the URL and redirect to 404 if not allowed
  useEffect(() => {
    if (currentUser.finished) {
      if (!canAccess) {
        // Redirect to 404 if the user is not found
        router.push('/404')
      }
    }
  }, [canAccess, currentUser])

  return (
    <Layout title="Shopping Cart" panelUser={<ToolBar />}>
      {!canAccess ? (
        <LoadingPage />
      ) : (
        <div className="page-wrapper">
          <h2>My shopping cart</h2>
          
          <div className="shopping-cart-wrapper">
            {!data && <div className="empty-shopping-cart">
              Your shopping cart is empty. Please, continue shopping.
            </div>}
            { data && <div className="shopping-cart">
              {JSON.stringify(data, null, 2)}
            </div>}
          </div>

          <div className="actions">
            <div className="action-wr">
              <Button>Continue to checkout</Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>
        {`
          
        `}
      </style>
    </Layout>
  )
}

export default ShoppingCart
