import './table-list.scss'
import Link from 'next/link'

const ListItem = (props) => {
  
  return <div className="list-item row">
    { props.type.fields.map((field, index) => {
      const value = props.item[field.name] ? props.item[field.name] : '-'
      const content = index === 0 ? <Link href={`/content/${props.type.slug}/${props.item.id}`}>{value}</Link> : value
      
      return (<div className="field-column column">
        {content}
      </div>)
    })}
  </div>
}

const TableHeader = (props) => {
  
  return <div className="table-header row ">
    { props.type.fields.map((field) => {
      
      return (<div className="header-column column">
        {field.name}
      </div>)
    })}
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
