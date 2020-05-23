import Button from '../../generic/button/button'
import { useState, useEffect } from 'react'
import API from '@lib/api/api-endpoints'
import fetch from '@lib/fetcher'


export const extractUserMentions = (text) => {

  const mentions = (text.match(/@([A-Za-z]+[A-Za-z0-9_-]+)/g)) || []

  let parsedText = text

  mentions.forEach(m  => {
    parsedText = text.replace(m, `[${m}](/profile/${m})`)
  })

  return {
    parsedText,
    mentions: [...new Set(mentions)]
  }
}

export default function ({
  contentId = '',
  comment = {},
  onChange = () => {},
  onSave = () => {},
  onCancel = () => {},
  type = {},
  conversationId = '',
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')

  const onChangeMessage = (ev) => {
    const newMessage = ev.target.value
    setMessage(newMessage)
    onChange(newMessage)
  }

  const onClickCancel = (ev) => {
    ev.preventDefault()
    setMessage('')
    onCancel()
  }

  const submitRequest = (data) => {
    const url = `${API.comments[type.slug]}/${contentId}/${
      comment.id ? '/' + comment.id + '?field=id' : ''
    }`

    return fetch(url, {
      method: comment.id ? 'PUT' : 'POST',
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

    const { parsedText , mentions } = extractUserMentions(message)

    submitRequest({
      message: parsedText,
      mentions, mentions,
      conversationId: conversationId ? conversationId : null,
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
      <div className="">
        <form onSubmit={onSubmit} className="form">
          <div className="input-group">
            <label for="your-comment">Add a new comment</label>
            <textarea
              value={message}
              placeholder="Your comment"
              onChange={onChangeMessage}
              id="your-comment"
            />
          </div>

          <div className="actions">
            <div className="action">
              <Button alt onClick={onClickCancel}>
                Cancel
              </Button>
            </div>
            <div className="action">
              <Button
                success
                loading={loading}
                title="Send comment"
                type="submit"
              >
                Send
              </Button>
            </div>
          </div>
          {error && <div className="error-message">Error posting comment </div>}
        </form>
      </div>
      <style jsx>{`
        form {
          margin: 0 auto;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          margin-top: var(--edge-gap-half-negative);
        }

        .action {
          margin-left: var(--edge-gap);
        }
      `}</style>
    </>
  )
}
