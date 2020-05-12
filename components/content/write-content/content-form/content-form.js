import { useEffect, useState } from 'react'

import API from '../../../../lib/api/api-endpoints'
import Button from '../../../generic/button/button'
import DynamicField from '../../../generic/dynamic-field/dynamic-field-edit'
import Toggle from '../../../generic/toggle/toggle'
import fetch from '../../../../lib/fetcher'
import { FIELDS } from '../../../../lib/config/config-constants'
import ContentSummaryView from '../../read-content/content-summary-view/content-summary-view'
import Link from 'next/link'

export default function (props) {
  const [preview, setPreview] = useState(false)

  // Saving states
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  // used to store values
  const [state, setState] = useState({})

  useEffect(() => {
    // Preload the form values
    if (props.type && props.content) {
      const filteredData = {}
      const allowedKeys = props.type.fields.map((f) => f.name).concat('draft')
      allowedKeys.map((k) => {
        filteredData[k] = props.content[k]
      })
      setState(filteredData)
    }
  }, [props.content, props.type])

  // Store the fields
  const handleFieldChange = (name) => (value) => {
    console.log('change', name, value)
    setState({
      ...state,
      [name]: value,
    })
  }

  const submitRequest = (data, jsonData) => {
    const url = `${API.content[props.type.slug]}${
      props.content.id ? '/' + props.content.id + '?field=id' : ''
    }`
    
    return fetch(url, {
      method: props.content.id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData),
    })
    .then((result) => {
      console.log(result)
      // Files are always updated as a PUT
      return fetch( `${API.content[props.type.slug]}${'/' + result.id + '?field=id'}`, {
        method: 'PUT',
        body: data,
      })
      
    })
  }

  

  const onSubmit = (ev) => {
    ev.preventDefault()

    const formData = new FormData();
    const jsonData = {}

    Object.keys(state).forEach((key) => {
      const fieldValue = state[key]
      const fieldDefinition = props.type.fields.find(t => t.name === key)
      
      console.log(fieldValue, key)
      
      if (fieldDefinition && (fieldDefinition.type === FIELDS.IMAGE || fieldDefinition.type === FIELDS.FILE)) {
        if (fieldValue && fieldValue.length > 0) {
          fieldValue.forEach(item => {
            
            if (item.isFile) {
              formData.append(key, item.file)
            } else {
              jsonData[key] = jsonData[key] ? [...jsonData[key], item] : [item]
            }
          })
        } else {
          jsonData[key] = []
        }
      } else {
        jsonData[key] = fieldValue
      }
      
    })

    setLoading(true)
    setSuccess(false)
    setError(false)

    submitRequest(formData, jsonData)
      .then((result) => {
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
      })
  }

  // It needs the type definition
  if (!props.type) {
    return <p>Missing type definition</p>
  }

  return (
    <>
      <div className="contentForm">
        <form name="content-form"  onSubmit={onSubmit}>
          {props.type.publishing.draftMode && (
            <div className="draft input-group">
              <label>Draft</label>
              <Toggle
                value={state['draft']}
                onChange={handleFieldChange('draft')}
              />
              {state.draft && <div>Your content will not be visible</div>}
            </div>
          )}

          {props.type.fields.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              value={state[field.name]}
              onChange={handleFieldChange(field.name)}
            />
          ))}

          <div className="actions">
            <Button loading={loading} alt={true} type="submit">
              Save
            </Button>
          </div>
        </form>

        {success && (
          <div className="success-message">
            Saved: You can see it{' '}
            <Link href={`/content/${props.type.slug}/${props.content.slug}`}>
              <a title="View content">here</a>
            </Link>
          </div>
        )}
        {error && <div className="error-message">Error saving </div>}

        <div className="preview">
            <ContentSummaryView content={state} type={props.type} />
        </div>
      </div>
      <style jsx>
        {`
          .contentForm {
            background: var(--empz-background);
            padding: var(--empz-gap);
            border: var(--light-border);
          }

          .actions {
            padding-top: var(--empz-gap);
          }
        `}
      </style>
    </>
  )
}
