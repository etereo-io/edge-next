import { ContentEntityType, ContentTypeDefinition } from '@lib/types'

import Button from '../button/button'
import React from 'react'

type PropTypes = {
  contentType : ContentTypeDefinition,
  content: ContentEntityType
}

export default function ContentBuyForm({
  contentType,
  content
}: PropTypes) {
  return (
    <>
      <div className="content-buy-form">
        <div className="quantity"></div>
        <div className="add-to-cart">
          <Button>Add to cart</Button>
        </div>
      </div>
      <style jsx>{
        `
        .badge {
          border-radius: borderRadius;
          
        }
        `
      }</style>
    </>
  )
}