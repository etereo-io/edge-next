import { CommentType, ContentTypeDefinition } from '@lib/types'
import { memo, useEffect, useState } from 'react'

import API from '@lib/api/api-endpoints'
import Button from '../../generic/button/button'
import EmojiPicker from '@components/generic/emoji-picker'
import fetch from '@lib/fetcher'

type PropTypes = {
  comment?: CommentType,
  contentId?: string,
  onChange?: (val: any) => void,
  onSave?: (val: any) => void,
  onCancel?: () => void,
  type: ContentTypeDefinition,
  conversationId?: string
}

function CommentForm({
  contentId = '',
  comment = {} as CommentType,
  onChange = (val: any) => {},
  onSave = (val: any) => {},
  onCancel = () => {},
  type = {} as ContentTypeDefinition,
  conversationId = '',
}: PropTypes) {
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
    const url = `${API.comments}${
      comment.id
        ? `/${comment.id}?field=id`
        : `?contentType=${type.slug}&contentId=${contentId}`
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

    submitRequest({
      message,
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

  const onSelectEmoji = (val) => {
    const newMessage = message + ' ' + val
    setMessage(newMessage)
    onChange(newMessage)
  }

  return (
    <>
      <div className="">
        <form onSubmit={onSubmit} className="form">
          <div className="input-group">
            <label htmlFor="your-comment">Add a new comment</label>
            <textarea
              value={message}
              placeholder="Your comment"
              onChange={onChangeMessage}
              id="your-comment"
            />
          </div>

          <div className="actions">
            <div className="action">
              <EmojiPicker onSelect={onSelectEmoji} />
            </div>
            <div className="action">
              <a
                href="https://memeful.com/"
                rel="noopener"
                target="_blank"
                title="Add gifs"
              >
                <i className="las la-hat-wizard" style={{fontSize: '18px'}}></i>
              </a>
            </div>
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

export default memo(CommentForm)
