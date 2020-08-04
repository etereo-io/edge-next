import { CommentType, ContentTypeDefinition } from '@lib/types'
import { useEffect, useState } from 'react'

import API from '@lib/api/api-endpoints'
import Button from '../../generic/button/button'
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

export default function ({
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
              <a
                href="https://memeful.com/"
                rel="noopener"
                target="_blank"
                title="Add gifs"
              >
                <svg
                  width="29.999999999999996"
                  height="34"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <title>background</title>
                    <rect
                      fill="none"
                      id="canvas_background"
                      height="36"
                      width="32"
                      y="-1"
                      x="-1"
                    />
                    <g
                      display="none"
                      overflow="visible"
                      y="0"
                      x="0"
                      height="100%"
                      width="100%"
                      id="canvasGrid"
                    >
                      <rect
                        fill="url(#gridpattern)"
                        stroke-width="0"
                        y="0"
                        x="0"
                        height="100%"
                        width="100%"
                      />
                    </g>
                  </g>
                  <g>
                    <title>Layer 1</title>
                    <line
                      stroke-linecap="undefined"
                      stroke-linejoin="undefined"
                      id="svg_1"
                      y2="214.972057"
                      x2="152.5"
                      y1="169.85"
                      x1="152.5"
                      stroke-width="1.5"
                      stroke="#000"
                      fill="none"
                    />
                    <line
                      stroke-linecap="undefined"
                      stroke-linejoin="undefined"
                      id="svg_2"
                      y2="28.104927"
                      x2="3.950712"
                      y1="3.939585"
                      x1="3.950712"
                      stroke-width="1.5"
                      stroke="#000"
                      fill="none"
                    />
                    <line
                      stroke-linecap="undefined"
                      stroke-linejoin="undefined"
                      id="svg_3"
                      y2="28.104927"
                      x2="3.950712"
                      y1="3.939585"
                      x1="3.950712"
                      stroke-width="1.5"
                      stroke="#000"
                      fill="none"
                    />
                    <line
                      stroke-linecap="undefined"
                      stroke-linejoin="undefined"
                      id="svg_5"
                      y2="27.468997"
                      x2="25.254971"
                      y1="27.468997"
                      x1="4.268677"
                      stroke-width="1.5"
                      stroke="#000"
                      fill="none"
                    />
                    <line
                      stroke="#000"
                      stroke-linecap="undefined"
                      stroke-linejoin="undefined"
                      id="svg_6"
                      y2="4.098568"
                      x2="17.792048"
                      y1="4.098568"
                      x1="4.268677"
                      stroke-width="1.5"
                      fill="none"
                    />
                    <line
                      stroke="#000"
                      stroke-linecap="undefined"
                      stroke-linejoin="undefined"
                      id="svg_8"
                      y2="10.608374"
                      x2="25.095386"
                      y1="27.468998"
                      x1="25.095386"
                      fill-opacity="null"
                      stroke-opacity="null"
                      stroke-width="1.5"
                      fill="none"
                    />
                    <line
                      stroke-linecap="undefined"
                      stroke-linejoin="undefined"
                      id="svg_9"
                      y2="11.597758"
                      x2="24.963416"
                      y1="4.098568"
                      x1="17.464225"
                      fill-opacity="null"
                      stroke-opacity="null"
                      stroke-width="1.5"
                      stroke="#000"
                      fill="none"
                    />
                    <line
                      stroke-linecap="undefined"
                      stroke-linejoin="undefined"
                      id="svg_10"
                      y2="12.206676"
                      x2="16.669313"
                      y1="12.206676"
                      x1="25.413351"
                      fill-opacity="null"
                      stroke-opacity="null"
                      stroke-width="1.5"
                      stroke="#000"
                      fill="none"
                    />
                    <line
                      stroke-linecap="undefined"
                      stroke-linejoin="undefined"
                      id="svg_11"
                      y2="13.003088"
                      x2="17.305243"
                      y1="4.575515"
                      x1="17.305243"
                      fill-opacity="null"
                      stroke-opacity="null"
                      stroke-width="1.5"
                      stroke="#000"
                      fill="none"
                    />
                    <text
                      font-weight="bold"
                      text-anchor="start"
                      font-family="Helvetica, Arial, sans-serif"
                      font-size="7"
                      id="svg_15"
                      y="20"
                      x="8"
                      fill-opacity="null"
                      stroke-opacity="null"
                      stroke-width="0"
                      stroke="#000"
                      fill="#000000"
                    >
                      GIF
                    </text>
                  </g>
                </svg>
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
