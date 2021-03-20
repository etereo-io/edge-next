import React, { Fragment, memo } from 'react'

import AuthorBox from '@components/user/author-box/author-box'
import { ContentEntityType } from '@lib/types'
import ContentSummaryView from '../content-summary-view/content-summary-view'
import { ContentTypeDefinition } from '@lib/types/contentTypeDefinition'
import DynamicFieldView from '@components/generic/dynamic-field/dynamic-field-view'
import Link from 'next/link'
import ProductPrice from '../purchasing-product-form/product-price'
import { useUser } from '@lib/client/hooks'

interface Props {
  content: ContentEntityType
  type: ContentTypeDefinition
}

function ProductSummaryView(props: Props) {


  const { user } = useUser()


  return (
    <>
      <article className="edge-item-card">


        <div className="edge-item-card-content">
          <Link href={`/content/${props.type.slug}/${props.content.seo.slug}`}>
            <a title="See product"><h2>{props.content.title}</h2></a>
          </Link>

          <Link href={`/content/${props.type.slug}/${props.content.seo.slug}`}>
            <a title="See product">
              <DynamicFieldView
                field={props.type.fields.find(i => i.name === 'images')}
                value={props.content.images}
                typeDefinition={props.type} />
            </a>
          </Link>
          
          <div className="price">
            <ProductPrice options={props.content.purchasingOptions} amount={1} />
          </div>

          <div className="author-info">
            <AuthorBox user={props.content ? props.content.user : null} />
          </div>
        </div>


      </article>
      <style jsx>{`
        
       .edge-item-card {
          background-color: var(--edge-background);
          border-radius: var(--edge-gap-half);
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          margin: 5px;
          padding: var(--edge-gap-half);
          position: relative;
          max-width: 200px;
          width: 200px;
       }

       h2 {
         font-size: 14px;
         margin-bottom: 5px;
       }

       .price {
         margin-top: 5px;
         margin-bottom: 5px;
       }
       
      `}</style>
    </>
  )
}

export default memo(ProductSummaryView)
