import { useEffect, useRef, useState } from 'react'
import useSWR , { useSWRPages } from 'swr'

import API from '../../../../lib/api/api-endpoints'
import Button from '../../../button/button'
import ContentSummaryView from '../content-summary-view/content-summary-view'
import fetch from '../../../../lib/fetcher'
import styles from './content-list-view.module.scss'
import { useOnScreen } from '../../../../lib/hooks'

function Placeholder() {
  return <div className="placeholders">
    <div className="p"></div>
    <div className="p"></div>
    <div className="p"></div>
    <div className="p"></div>
    <div className="p"></div>
  </div>
}

function EmptyComponent() {
  return <div className="empty">
    Sorry, no items found.
  </div>
}

export default function(props) {

  // Fetch content type page by page
  const { pages, isLoadingMore, loadMore, isEmpty, isReachingEnd } = useSWRPages(
    "content-list",
    ({ offset, withSWR }) => {
      
      const apiUrl = `${API.content[props.type.slug]}?limit=10${offset ? '&from=' + offset : ''}`
      const { data } = withSWR(useSWR(apiUrl, fetch, props.data || []));

      if (!data) return <Placeholder/>;

      const { results } = data;
      return results.map(item => {
         return <ContentSummaryView className={styles['content-summary-view']} key={item.id} content={item} type={props.type} />
      })
    },
    SWR => {
      // Calculates the next page offset
      return SWR.data && SWR.data.results && SWR.data.results.length >= 10 ? SWR.data.from * 1 + SWR.data.limit * 1 : null
    },
    []
  );

  const $loadMoreButton = useRef(null);
  const isOnScreen = useOnScreen($loadMoreButton, "200px");

  useEffect(() => {
    if (isOnScreen) loadMore();
  }, [isOnScreen]);

  
  return <div className={styles.contentListView}>
    { !isEmpty ? pages : <EmptyComponent /> }
    <div id="load-more">
      {isReachingEnd
        ? null
        : <Button reference={$loadMoreButton} loading={isLoadingMore} onClick={loadMore}>Load More</Button>}
    
    </div>
  </div>
}