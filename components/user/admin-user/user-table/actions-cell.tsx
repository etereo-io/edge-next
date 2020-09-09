import React, { useState, memo, useCallback } from 'react'

import Button from '@components/generic/button/button'

const ActionsCell = ({
  blockRequest,
  id,
  blocked: defaultBlocked,
  deleteRequest,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [blocked, setBlocked] = useState<boolean>(defaultBlocked)
  const [isDeleted, setIsDeleted] = useState<boolean>(defaultBlocked)

  const onClickBlockUser = useCallback(() => {
    const result = window.confirm('Are you sure you want to block this user?')

    if (result) {
      setLoading(true)
      setError(false)

      blockRequest(id, !blocked)
        .then(() => {
          setError(false)
          setBlocked(!blocked)
        })
        .catch(() => {
          alert('User could not be blocked')
        })
        .finally(() => setLoading(false))
    }
  }, [blockRequest, id, blocked, setBlocked])

  const onClickDelete = useCallback(() => {
    const result = window.confirm('Are you sure you want to delete this user?')

    if (result) {
      setLoading(true)
      setError(false)

      deleteRequest(id)
        .then(() => {
          setError(false)
          setIsDeleted(true)
        })
        .catch(() => {
          setError(true)
        })
        .finally(() => setLoading(false))
    }
  }, [deleteRequest, id, setIsDeleted])

  return (
    <>
      {!isDeleted && <Button href={`/settings/${id}`}>Edit</Button>}
      {!isDeleted && (
        <Button loading={loading} alt={true} onClick={onClickDelete}>
          Delete
        </Button>
      )}

      {!isDeleted && (
        <Button
          loading={loading}
          warning={!blocked}
          secondary={blocked}
          onClick={onClickBlockUser}
        >
          {blocked ? 'Unblock' : 'Block'}
        </Button>
      )}

      {error && <div className="error">Error deleting item</div>}
      {isDeleted && <div className="success">Item deleted</div>}
      <style jsx>{`
        .button-wr {
          margin: 0 8px 0 8px;
        }

        .button-wr:last-of-type {
          margin: 0;
        }
      `}</style>
    </>
  )
}

export default memo(ActionsCell)
