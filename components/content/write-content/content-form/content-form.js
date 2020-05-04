import { useEffect, useState } from 'react'

import API from '../../../../lib/api/api-endpoints'
import Button from '../../../generic/button/button'
import DynamicField from'../../../generic/dynamic-field/dynamic-field'
import Toggle from '../../../generic/toggle/toggle'
import fetch from '../../../../lib/fetcher'
import Link from 'next/link'

export default function (props) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const [state, setState] = useState({})
  
  useEffect(() => {
    setState(props.content)
  }, [props.content, props.type])

  // Generic field change
  const handleFieldChange = (name) => (value) => {
    setState({
      ...state,
      [name]: value,
    })
  }

  const submitRequest = (data) => {
    const url = `${API.content[props.type.slug]}${
      props.content.id ? '/' + props.content.id + '?field=id' : ''
    }`

    return fetch(url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        //'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
      },
    })
  }

  const onSubmit = (ev) => {
    ev.preventDefault()

    /*const data = new URLSearchParams()
    Object.keys(state).forEach((key) => {
      const fieldValue = state[key]

      const fieldDefinition = props.type.fields.find(t => t.name === key)

      // TODO: Do client side validations
      if (typeof fieldValue !== 'undefined') {
        if (fieldDefinition && fieldDefinition.type === 'tags') {
          data.append(key, JSON.stringify(fieldValue))
        } else {
          data.append(key, fieldValue)
        }
      }
    })*/

    const filteredData = {}
    const allowedKeys = props.type.fields.map(f => f.name).concat('draft')
    allowedKeys.map(k => {
      filteredData[k] = state[k]
    })

    setLoading(true)
    setSuccess(false)
    setError(false)

    submitRequest(filteredData)
      .then((result) => {
        console.log(result)
        setLoading(false)
        setSuccess(true)
        setError(false)

        if (props.onSave) {
          props.onSave(result)
        }
      })
      .catch((err) => {
        setLoading(false)
        setSuccess(false)
        setError(true)
        console.error(err)
      })
  }

  // It needs the type definition
  if (!props.type) {
    return <p>Missing type definition</p>
  }

  return (
      <>
      <div className='contentForm'>
        <form name="content-form" onSubmit={onSubmit}>

          {props.type.publishing.draftMode && <div className="draft input-group">
            <label>Draft</label>
            <Toggle value={state['draft']} onChange={handleFieldChange('draft')} />
            { state.draft && <div>Your content will not be visible</div>}
          </div>}
          
          {props.type.fields.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              value={state[field.name]}
              onChange={handleFieldChange(field.name)}
            />
          ))}

          <div className='actions'>
            <Button loading={loading} alt={true} type="submit">
              Save
            </Button>
          </div>
        </form>

        {success && <div className="success-message">Saved: You can see it <Link href={`/content/${props.type.slug}/${props.content.slug}`}><a title="View content">here</a></Link></div>}
        {error && <div className="error-message">Error saving </div>}
      </div>
      <style jsx>
        {
          `
          .contentForm {
            background: var(--empz-background);
            padding: var(--empz-gap);
            border:var(--light-border);
          }

          .actions {
            padding-top: var(--empz-gap);
          }
          `
        }
      </style>
    </>
  )
}
