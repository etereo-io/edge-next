const ListItem = props => {
  return (
    <div className="list-item">
      {JSON.stringify(props.item)}
    </div>
  )
}

export default function (props) {
  const listItems = props.items.map(item => <ListItem item={item} />)
  return (
    <div className="table-list">
      { props.loading ? <DummyItems /> : listItems}
    </div>
  )
}