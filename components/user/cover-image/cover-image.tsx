import React, { memo } from 'react'

import LoadingPlaceholder from '@components/generic/loading/loading-placeholder/loading-placeholder'
import { UserType } from '@lib/types'

type Props = {
  user?: UserType
  loading?: boolean
}

function CoverImage({ user, loading = false }: Props) {
  return (
    <>
      <div className="cover-image-wrapper">
        {loading && <LoadingPlaceholder width="100%" height="100%" />}
        {!loading && <div className="cover-image" />}
      </div>
      <style jsx>{`
      .cover-image-wrapper {
        height: 280px;
        overflow: hidden;
      }

      .cover-image {
        background-size: cover;
        height: 100%;
        background-position: center;
        background-image: url("${
          user && user.profile.cover
            ? user.profile.cover.path
            : '/static/demo-images/default-background.jpg'
        }");
      }

      @media all and (max-width: 720px){
        .cover-image-wrapper {
          height: 210px;
        }
      } 
    `}</style>
    </>
  )
}

export default memo(CoverImage)
