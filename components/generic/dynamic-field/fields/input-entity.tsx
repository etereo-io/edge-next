import { useEffect, useState, memo, useCallback, useMemo } from 'react'

import Table, {
  TableCellBody,
  TableCellHeader,
  TableRowBody,
} from '@components/generic/table/table'
import Button from '@components/generic/button/button'
import EntitySearch from '@components/generic/entity-search/entity-search'

function InputEntity(props) {
  const [val, setVal] = useState(props.value || [])

  const validate = useCallback(
    (value) => () => {
      return !(props.field.required && value.length === 0)
    },
    [props.field.required]
  )

  const onChange = useCallback(
    (item) => {
      const newVal = props.field.multiple ? [item, ...val] : [item]

      setVal(newVal)
      props.onChange(newVal, validate)
    },
    [setVal, val, props]
  )

  const removeItem = useCallback(
    (item) => {
      const newVal = val.filter((i) => i.id !== item.id)
      setVal(newVal)
      props.onChange(newVal, validate)
    },
    [setVal, props.onChange, val]
  )

  useEffect(() => {
    setVal(val)
  }, [props.value])

  const headerCells = useMemo(
    () => [
      <TableCellHeader key={`${props.field.name}-header-title`}>
        Item
      </TableCellHeader>,
      <TableCellHeader key={`${props.field.name}-header-actions`}>
        Actions
      </TableCellHeader>,
    ],
    [props.field.name]
  )

  return (
    <div className="input-entity" data-testid={props['data-testid']}>
      <EntitySearch
        placeholder={props.field.placeholder}
        entity={props.field.entity}
        entityType={props.field.entityType}
        entityName={props.field.entityName}
        onChange={onChange}
      />

      <div className="results">
        <Table headerCells={headerCells}>
          {val.length > 0 ? (
            val.map((item) => {
              return (
                <TableRowBody key={`${props.field.name}-${item.id}`}>
                  <TableCellBody>{props.field.entityName(item)}</TableCellBody>
                  <TableCellBody>
                    <Button onClick={() => removeItem(item)}>Remove</Button>
                  </TableCellBody>
                </TableRowBody>
              )
            })
          ) : (
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

export default memo(InputEntity)
