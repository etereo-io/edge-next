import React, { Fragment, memo } from 'react'

import AuthorBox from '@components/user/author-box/author-box'
import { ContentEntityType } from '@lib/types'
import ContentSummaryView from '../content-summary-view/content-summary-view'
import { ContentTypeDefinition } from '@lib/types/contentTypeDefinition'
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
        
        <div className="edge-item-card-header">

          {!props.content.draft && (
            <div className="author-info">
              <AuthorBox user={props.content ? props.content.user : null} />
            </div>
          )}
          
        </div>
        <div className="edge-item-card-content">
          <ContentSummaryView
            content={props.content}
            summary={true}
            type={props.type}
            user={user}
          />
        </div>
              
        
      </article>
      <style jsx>{`
        
       .edge-item-card {
          background-color: var(--edge-background);
          border-radius: var(--edge-gap-half);
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: var(--edge-gap);
          padding: var(--edge-gap-medium);
          position: relative;
       }

       
      `}</style>
    </>
  )
}

export default memo(ProductSummaryView)
