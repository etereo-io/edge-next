import Table, { TableCell, TableRow } from '../../../generic/table/table'
import useSWR , { useSWRPages } from 'swr'

import API from '../../../../lib/api/api-endpoints'
import Button from '../../../generic/button/button'
import Link from 'next/link'
import fetch from '../../../../lib/fetcher'
import { useState } from 'react'

const ListItem = (props) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const deleteRequest = () => {
    const url = `${API.content[props.type.slug]}/${props.item.id}?field=id`
    return fetch(url, {
      method: 'delete',
    })
  }

  const onClickDelete = (ev) => {
    const result = window.confirm('Are you sure you want to delete this item?')

    if (result) {
      setLoading(true)
      setSuccess(false)
      setError(false)

      deleteRequest()
        .then((result) => {
          console.log(result)
          setLoading(false)
          setSuccess(true)
          setError(false)
        })
        .catch((err) => {
          setLoading(false)
          setSuccess(false)
          setError(true)
          console.error(err)
        })
    }
  }

  return (
      <TableRow>
        {props.type.fields.map((field, index) => {
          const value = props.item[field.name] ? props.item[field.name] : '-'
          const content =
            index === 0 ? (
              <Link href={`/content/${props.type.slug}/${props.item.slug}`}>
                {typeof value === 'string' ? value : JSON.stringify(value)}
              </Link>
            ) : (
              typeof value === 'string' ? value : JSON.stringify(value)
            )

          return <TableCell>{content}</TableCell>
        })}
        <TableCell>0 Comments</TableCell>
        <TableCell>0 times</TableCell>
        <TableCell>
          {!success && (
            <Button href={`/edit/${props.type.slug}/${props.item.slug}`}>
              Edit
            </Button>
          )}
          {!success && (
            <Button loading={loading} alt={true} onClick={onClickDelete}>
              Delete
            </Button>
          )}
          {error && <div className="error">Error deleting item</div>}
          {success && <div className="success">Item deleted</div>}
        </TableCell>
      </TableRow>
  )
}


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


export default function (props) {

  // Fetch content type page by page
  const { pages, isLoadingMore, loadMore, isEmpty, isReachingEnd } = useSWRPages(
    `admin-content-${props.type.slug}-list`,
    ({ offset, withSWR }) => {
      
      const apiUrl = `${API.content[props.type.slug]}?limit=10${offset ? '&from=' + offset : ''}`
      const { data } = withSWR(useSWR(apiUrl, fetch));

      if (!data) return <Placeholder/>;

      const { results } = data;
      return results.map(item => {
         return <ListItem key={item.id} type={props.type} item={item} />
      })
    },
    SWR => {
      // Calculates the next page offset
      return SWR.data && SWR.data.results && SWR.data.results.length >= 10 ? SWR.data.from * 1 + SWR.data.limit * 1 : null
    },
    []
  );

  const headerCells = props.type.fields.map((field) => {
    return <TableCell>{field.name}</TableCell>
  })

  headerCells.push(<TableCell>Comments</TableCell>)
  headerCells.push(<TableCell>Reported</TableCell>)
  headerCells.push(<TableCell>Actions</TableCell>)
 
  return (
    <div className='content-list'>
      <Table headerCells={headerCells}>
        {!isEmpty ? pages: <EmptyComponent />}
      </Table>
      
      <div id="load-more">
          {isReachingEnd
            ? null
            : <Button loading={isLoadingMore} big={true} onClick={loadMore}>Load More</Button>}
        
        </div>
    </div>
  )
}
