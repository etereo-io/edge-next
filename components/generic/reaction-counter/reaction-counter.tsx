import React, { memo } from 'react'

import Favorite from '@icons/favorite.svg'
import Follow from '@icons/follow.svg'
import Like from '@icons/like.svg'
import LoadingSpinner from '@components/generic/loading/loading-spinner/loading-spinner'

function getIcon(type) {
  switch (type) {
    case 'like':
      return Like
    case 'follow':
      return Follow
    case 'favorite':
      return Favorite
    default:
      return ''
  }
}

type Props = {
  count: number
  type?: string
  onClick?: () => void
  title?: string
  active?: boolean
  disabled?: boolean
  isLoading?: boolean
}

function ReactionCounter({
  count = 0,
  type = 'like',
  onClick = () => {},
  active = false,
  disabled = false,
  isLoading = false,
  title = '',
}: Props) {
  const Icon = getIcon(type)
  const firstTypeLetter = type[0].toUpperCase()

  return (
    <>
      <div className={`reaction-wr ${active ? 'active' : ''}`}>
        <div className="reaction-item-wr" onClick={onClick} title={title}>
          {isLoading ? (
            <LoadingSpinner />
          ) : Icon ? (
            <Icon
              className={`${
                active ? 'active' : ''
              } reaction-item reaction-item-${type}  ${
                disabled ? 'disabled' : ''
              }
            `}
            />
          ) : (
            <div
              className={`reaction-item reaction-item-${type} ${
                active ? 'active' : ''
              } ${disabled ? 'disabled' : ''}`}
            >
              <span>{firstTypeLetter}</span>
            </div>
          )}
        </div>
        <span className="reaction-counter">{count}</span>
      </div>
      <style global jsx>{`
        .reaction-wr {
          align-items: center;
          text-align: center;
          display: flex;
          margin-left: var(--edge-gap);
        }

        .reaction-wr:first-of-type{
          margin-left: 0;
        }

        .reaction-counter {
          color: var(--accents-3);
          font-size: 13px;
          margin-left: 4px;
        }

        .reaction-item-wr {
          align-items: center;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          height: 32px;
          position: relative;
          width: 32px;
        }

        .reaction-item-wr:before,
        .reaction-item-wr:after {
          border: 2px solid var(--accents-2);
          box-sizing: content-box;
          content: '';
          position: absolute;
          height: 100%;
          width: 100%;
          border-radius: 50%;
          pointer-events: none;
        }

        .reaction-item-wr:after {
          border-color: var(--edge-alert);
          opacity: 0;
          transition: 0.35s ease;
        }

        .reaction-item {
          transition: 0.35s ease;
          width: 16px;
        }

        .reaction-item-wr:hover .reaction-item {
          transform: scale(0.8);
        }

        .reaction-item-wr:hover:after {
          animation: reactionItemAfter 0.35s ease-in-out forwards;

          @keyframes reactionItemAfter {
            10% {
              opacity: 1;
            }

            100% {
              opacity: 0;
              border-width: 6px;
            }
          }
        }

        .reaction-item path {
          fill: var(--accents-3);
          transition: 0.35s ease;
        }

        .reaction-item span {
          color: var(--accents-3);
          transition: 0.35s ease;
        }

        .active.reaction-item path {
          fill: var(--edge-alert);
          stroke: var(--edge-alert);
        }

        .active.reaction-item span {
          color: var(--edge-alert);
        }

        .reaction-item-wr:hover .reaction-item path {
          fill: var(--edge-alert);
          color: var(--edge-alert);
          stroke: var(--edge-alert);
        }

        .reaction-item-wr:hover .reaction-item span {
          color: var(--edge-alert);
        }

        .reaction-item.disabled {
          cursor: default;
        }
      `}</style>
    </>
  )
}

export default memo(ReactionCounter)
