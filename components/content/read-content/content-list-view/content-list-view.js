import useSWR , { useSWRPages } from 'swr'
import { useState, useRef, useEffect } from 'react'
import fetch from '../../../../lib/fetcher'
import API from '../../../../lib/api/api-endpoints'
import { useOnScreen } from '../../../../lib/hooks'
import Button from '../../../button/button'

import ContentSummaryView from '../content-summary-view/content-summary-view'
import styles from './content-list-view.module.scss'

function Placeholder() {
  return <div className="placeholders">
    <div className="p"></div>
    <div className="p"></div>
    <div className="p"></div>
    <div className="p"></div>
    <div className="p"></div>
  </div>
}

export default function(props) {

  // Fetch content type page by page
  const { pages, isLoadingMore, loadMore, isReachingEnd } = useSWRPages(
    "content-list",
    ({ offset, withSWR }) => {
      
      const apiUrl = `${API.content[props.type.slug]}?limit=10${offset ? '&from=' + offset : ''}`
      const { data } = withSWR(useSWR(apiUrl, fetch, props.data || []));

      if (!data) return <Placeholder/>;

      const { results } = data;
      return results.map(item => {
         return <ContentSummaryView key={item.id} content={item} type={props.type} />
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
    { pages }
    <div id="load-more">
      {isReachingEnd
        ? null
        : <Button reference={$loadMoreButton} loading={isLoadingMore} onClick={loadMore}>Load More</Button>}
    
    </div>
  </div>
}