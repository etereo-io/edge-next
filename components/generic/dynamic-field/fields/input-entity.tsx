import Table, {
  TableCellBody,
  TableCellHeader,
  TableRowBody,
} from '@components/generic/table/table'
import { useEffect, useState } from 'react'

import Button from '@components/generic/button/button'
import EntitySearch from '@components/generic/entity-search/entity-search'

export default function InputEntity(props) {
  const [val, setVal] = useState(props.value || [])

  const validate = (value) => {
    return props.field.required && value.length === 0 ? false : true
  }

  const onChange = item => {
    const newVal = props.field.multiple ? [item, ...val] : [item]
    
    setVal(newVal)
    props.onChange(newVal, validate(newVal))
  }

  const removeItem = item => {
    const newVal = val.filter(i => i.id !== item.id)
    setVal(newVal)
    props.onChange(newVal, validate(newVal))
  }

  useEffect(() => {
    setVal(val)
  }, [props.value])

  const headerCells = [
    (<TableCellHeader key={`${props.field.name}-header-title`}>
      Item
    </TableCellHeader>),
    (<TableCellHeader key={`${props.field.name}-header-actions`}>
      Actions
    </TableCellHeader>),
  ]

  return (
    <div className="input-entity" data-testid={props['data-testid']} >
      <EntitySearch placeholder={props.field.placeholder} entity={props.field.entity} entityType={props.field.entityType} entityName={props.field.entityName} onChange={onChange} />

      <div className="results">
      
          <Table headerCells={headerCells}>
            {val.length > 0 ? val.map(item => {
              return (
                <TableRowBody key={`${props.field.name}-${item.id}`}>
                  <TableCellBody>{props.field.entityName(item)}</TableCellBody>
                  <TableCellBody><Button onClick={() => removeItem(item)}>Remove</Button></TableCellBody>
              </TableRowBody>)
            }) : (
              <TableRowBody>
                  <TableCellBody>No items found</TableCellBody>
                  <TableCellBody>-</TableCellBody>
              </TableRowBody>
            )}
            

          </Table>
        
      </div>
    </div>
  )
}