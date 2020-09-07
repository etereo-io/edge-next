import React, { memo } from 'react'

interface Props {
  text?: string
  imageTitle?: string
}

function EmptyList({
  text = 'Nothing found',
  imageTitle = 'Nothing found',
}: Props) {
  return (
    <>
      <div className="empty">
        <h3>{text}</h3>
        <div className="empty-image">
          <img
            title={imageTitle}
            src="/static/demo-images/confused-travolta.webp"
            alt="empty list"
          />
        </div>
      </div>
      <style jsx>{`
        h3 {
          text-align: center;
        }
        .empty-image {
          width: 200px;
          margin: 0 auto;
        }
        img {
          max-width: 100%;
        }
      `}</style>
    </>
  )
}

export default memo(EmptyList)
