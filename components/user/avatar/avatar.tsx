const defaultSrc = '/static/demo-images/default-avatar.jpg'

import { useEffect, useState } from 'react'

import { UserType } from '@lib/types'

type PropTypes = {
  user?: UserType,
  title?: string,
  status?: string,
  width?: string,
  className?: string,
  radius?: string,
  loading?: boolean,
  src?: string
}

export default function ({
  user = {
    profile: {
      picture: {
        path: ''
      }
    }
  } as UserType,
  title,
  status,
  width = '100px',
  className = '',
  radius = '15%',
  src = '',
  loading = false
} : PropTypes) {

  const computedTitle = title ? title : `${user?.username} avatar`
  const recentlyActive = user && user.metadata && user.metadata.lastLogin
    ? (Date.now() - user.metadata.lastLogin < (10 * 60 * 1000))
    : false

  const computedStatus = status ? status : (recentlyActive ? 'active' : '')
  const [computedSrc, setComputedSrc] = useState(defaultSrc)

  const onImageError = () => {
    setComputedSrc(defaultSrc)
  }

  useEffect(() => {
    if(src) {
      setComputedSrc(src)
    }
  }, [src])

  useEffect(() => {
    if (user && user.profile?.picture?.path) {
      setComputedSrc(user.profile.picture.path)
    }
  }, [user])

  return (
    <>
      <div
        className={`avatar ${className} ${
          status ? 'has-status' : ''
        } ${computedStatus}`}
      >
        {!loading && (
          <img onError={onImageError} title={computedTitle} src={computedSrc}></img>
        )}
        {loading && (
          <div className="empty-avatar">
            <img src="/static/demo-images/loading-avatar.gif" />
          </div>
        )}
      </div>
      <style jsx>{`
        img {
          border-radius: ${radius};
          overflow: hidden;
          width: 100%;
        }

        .empty-avatar {
          width: 100%;
          height: 100%;
          border: var(--light-border);
          display: block;
          border-radius: 8px;
        }

        .avatar {
          border-radius: ${radius};
          display: inline-block;
          height: ${width};
          max-height: 80px;
          max-width: 80px;
          vertical-align: middle;
          width: ${width};
          position: relative;
        }

        @media all and (max-width: 720px) {
          .avatar {
            max-height: 64px;
            max-width: 64px;
          }
        }

        .avatar img {
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .avatar.has-status:after {
          border: 2px solid var(--edge-background);
          border-radius: 50%;
          box-sizing: content-box;
          content: '';
          height: 8px;
          position: absolute;
          display: block;
          top: 0;
          right: 0;
          transform: translate(1px, -1px);
          width: 8px;
        }

        .avatar.has-status.available:after {
          background-color: var(--edge-success);
        }
      `}</style>
    </>
  )
}
