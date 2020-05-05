import Button from '../../generic/button/button'
import { useState, useEffect } from 'react'
import API from '../../../lib/api/api-endpoints'
import fetch from '../../../lib/fetcher'

export default function ({ content = {}, comment={}, onChange = () => {}, onSave = () => {}, type = {}}) {
  const [loading, setLoading ] = useState(false)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState(null)

  const onChangeMessage = ev => {
    const newMessage = ev.target.value
    setMessage(newMessage)
    onChange(newMessage)
  }

  const submitRequest = (data) => {
    const url = `${API.comments[type.slug]}/${content.id}/${
      comment.id ? '/' + comment.id + '?field=id' : ''
    }`

    return fetch(url, {
      method: comment.id ? 'PUT': 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const onSubmit = (ev) => {
    ev.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(false)

    submitRequest(filteredData)
      .then((result) => {
        setLoading(false)
        setSuccess(true)
        setError(false)

        setMessage(null)

        if (onSave) {
          onSave(result)
        }
      })
      .catch((err) => {
        setLoading(false)
        setSuccess(false)
        setError(true)
      })
    
  }

  useEffect(() => {
    setMessage(comment.message)
  }, [comment])

  return (
    <>
      <div className=''>
        <form onSubmit={onSubmit} className='form'>
          <textarea value={message} placeholder="Your comment" onChange={onChangeMessage}/>
          <Button loading={loading} title="Send comment" type="submit">Send</Button>
        </form>
        {error && <div className="error-message">Error posting comment </div>}
      </div>
      <style jsx>{
        `
        
          form {
            max-width: 500px;
            margin: 0 auto;
          }
        
        `
      }</style>
    </>
  )
}
