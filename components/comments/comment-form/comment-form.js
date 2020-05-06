import Button from '../../generic/button/button'
import { useState, useEffect } from 'react'
import API from '../../../lib/api/api-endpoints'
import fetch from '../../../lib/fetcher'

export default function ({ contentId='', comment={}, onChange = () => {}, onSave = () => {}, type = {}}) {
  const [loading, setLoading ] = useState(false)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')

  const onChangeMessage = ev => {
    const newMessage = ev.target.value
    setMessage(newMessage)
    onChange(newMessage)
  }

  const submitRequest = (data) => {
    const url = `${API.comments[type.slug]}/${contentId}/${
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

    // TODO: add a blocking mechanism to not allow the user post too fast
    // TODO: include recaptcha
    if (!message || loading) {
      return 
    }

    setLoading(true)
    setError(false)

    submitRequest({
      message
    })
      .then((result) => {
        setLoading(false)
        setError(false)
        setMessage('')

        if (onSave) {
          onSave(result)
        }
      })
      .catch((err) => {
        setLoading(false)
        setError(true)
      })
    
  }

  useEffect(() => {
    if (comment.message) {
      setMessage(comment.message)
    }
  }, [comment, setMessage])

  return (
    <>
      <div className=''>
        <form onSubmit={onSubmit} className='form'>
          <textarea value={message} placeholder="Your comment" onChange={onChangeMessage}/>
          
          <div className="actions">
            <div className="action">
              <Button alt onClick={(ev) => { ev.preventDefault(); setMessage('')}}>Cancel</Button> 
            </div>
            <div className="action">
              <Button success loading={loading} title="Send comment" type="submit">Send</Button>
            </div>
          </div>
          {error && <div className="error-message">Error posting comment </div>}
        </form>
      </div>
      <style jsx>{
        `
          form {
            max-width: 500px;
            margin: 0 auto;
          }

          .actions {
            display: flex;
            justify-content: flex-end;
          }

          .action {
            margin-left: var(--empz-gap);
          }
        
        `
      }</style>
    </>
  )
}
