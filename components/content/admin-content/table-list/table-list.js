import './table-list.scss'
import Link from 'next/link'
import { useState } from 'react'
import Button from '../../../button/button'
import API from '../../../../lib/api/api-endpoints'
import fetch from '../../../../lib/fetcher'


const ListItem = (props) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)


  const deleteRequest = () => {
    const url = `${API.content[props.type.slug]}/${props.item.id}?field=id`
    return fetch(url, {
      method: 'delete'
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
        .catch(err => {
          setLoading(false)
          setSuccess(false)
          setError(true)
          console.error(err)
        })
    }
  }
  
  return (
  <div className="list-item">
    <div className="row">
      { props.type.fields.map((field, index) => {
        const value = props.item[field.name] ? props.item[field.name] : '-'
        const content = index === 0 ? <Link href={`/content/${props.type.slug}/${props.item.id}`}>{value}</Link> : value
        
        return (<div className="field-column column">
          {content}
        </div>)
      })}
    </div>
    <div className="row">
      <div className="column">
        {!success && (<Button href={`/edit/${props.type.slug}/${props.item.id}`}>Edit</Button>)}
        {!success && (<Button loading={loading} alt={true} onClick={onClickDelete}>Delete</Button>)}
      </div>

      <div className="column">
        {error && (<div className="error">Error deleting item</div>)}
        {success && (<div className="success">Item deleted</div>)}
      </div>

    </div>
  </div>)
}

const TableHeader = (props) => {
  
  return <div className="table-header row ">
    { props.type.fields.map((field) => {
      
      return (<div className="header-column column">
        {field.name}
      </div>)
    })}
    <div className="header-column column">
      Actions
    </div>
  </div>
}


export default function (props) {
  const listItems = props.items.map((item) => <ListItem type={props.type} item={item}  />)
  return (
    <div className="table-list">
      <TableHeader type={props.type} />
      <div className="table-items">
        {props.loading ? <DummyItems /> : listItems}
      </div>
    </div>
  )
}
