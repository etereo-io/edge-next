import './table-list.scss'
import Link from 'next/link'
import Button from '../../../button/button'

const ListItem = (props) => {

  const onClickDelete = () => {
    const result = window.confirm('Are you sure you want to delete this item?')

    if (result) {
      props.onDeleteItem(props.item)
    }
  }
  
  return <div className="list-item row">
    { props.type.fields.map((field, index) => {
      const value = props.item[field.name] ? props.item[field.name] : '-'
      const content = index === 0 ? <Link href={`/content/${props.type.slug}/${props.item.id}`}>{value}</Link> : value
      
      return (<div className="field-column column">
        {content}
      </div>)
    })}
    <div className="field-column column">
      <Button href={`/edit/${props.type.slug}/${props.item.id}`}>Edit</Button>
      <Button alt={true} onClick={onClickDelete}>Delete</Button>
    </div>
  </div>
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
  const listItems = props.items.map((item) => <ListItem type={props.type} item={item} />)
  return (
    <div className="table-list">
      <TableHeader type={props.type} />
      <div className="table-items">
        {props.loading ? <DummyItems /> : listItems}
      </div>
    </div>
  )
}
