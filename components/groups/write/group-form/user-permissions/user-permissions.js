import UserSearcher from '@components/user/search-users/search-users'
import Button from '@components/generic/button/button'
import { useState, useEffect } from 'react'
import Table, {
  TableCellBody,
  TableCellHeader,
  TableRowBody,
} from '@components/generic/table/table'

export default function({ users = [], onChange, roles = []}) {
  const [items, setItems ] = useState([])

  useEffect(() => {
    setItems(users)
  }, [users])

  const addUser = (u) => {
    const newItems = [
      ...items,
      {
        ...u,
        roles: [roles[0].value]
      }
    ]

    setItems(newItems)

    onChange(newItems)
    console.log(newItems)
  }

  const removeUser = u => {
    const newItems = items.filter(i => i.id !== u.id)

    setItems(newItems)
    onChange(newItems)
  }

  const setUserRole = (user, role) => {
    const newItems = items.map(i => {
      if (i.id !== user.id) {
        return i
      } else {
        return {
          ...i,
          roles: [role]
        }
      }
    })

    setItems(newItems)
    onChange(newItems)
  }


  const headerCells = [
    (<TableCellHeader>
      User
    </TableCellHeader>),
    (<TableCellHeader>
      Role
    </TableCellHeader>),
    (<TableCellHeader>
      Actions
    </TableCellHeader>),
  ]

  return (
    <>
      <div className="user-permissions">
        <div className="user-permissions-top">
          <UserSearcher onSelect={(user) => addUser(user)} />
        </div>
        <div className="user-list">
          <Table headerCells={headerCells}>
            {items.map(u => {
              return (
              
                <TableRowBody>
                  <TableCellBody>{u.username || u.email}</TableCellBody>
                  <TableCellBody>
                    <select className="select-role" value={u.roles[0]} onChange={(ev) => setUserRole(u, ev.target.value)}>
                      { roles.map(groupRole => {
                        return (<option value={groupRole.value}>{groupRole.label}</option>)
                      })}
                  </select>
                </TableCellBody>
                <TableCellBody><Button onClick={() => removeUser(u)}>Remove</Button></TableCellBody>
               
              </TableRowBody>)
            })}

          </Table>
        </div>
      </div>
      <style jsx>{
        `
        .user-permissions-top{
          margin-bottom: var(--edge-gap); 
        }

        .select-role {
          min-width: 200px;
        }
        `
      }</style>
    </>
  )
}