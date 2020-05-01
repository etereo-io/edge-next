import API from '../../../../lib/api/api-endpoints'
import Button from '../../../generic/button/button'
import DynamicField from'../../../generic/dynamic-field/dynamic-field'
import Toggle from '../../../generic/toggle/toggle'
import config from '../../../../lib/config'
import fetch from '../../../../lib/fetcher'
import styles from './content-form.module.scss'
import { useState } from 'react'

export default function (props) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  // Store default state with values from the content or default values
  const defaultState = {}

  props.type.fields.forEach((field) => {
    // Default field value
    const fieldValue = field.value

    // Content value
    defaultState[field.name] = props.content
      ? props.content[field.name]
      : fieldValue
  })

  const [state, setState] = useState(defaultState)

  // Generic field change
  const handleFieldChange = (name) => (value) => {
    console.log(name, value)
    setState({
      ...state,
      [name]: value,
    })
  }

  const submitRequest = (data) => {
    const url = `${API.content[props.type.slug]}${
      props.content ? '/' + props.content.id + '?field=id' : ''
    }`

    return fetch(url, {
      method: 'post',
      body: data,
      /* headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*'
      }),*/
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  const onSubmit = (ev) => {
    ev.preventDefault()

    console.log('THe state, st', state)

    const data = new URLSearchParams()
    Object.keys(state).forEach((key) => {
      const fieldValue = state[key]
      // TODO: Do client side validations
      data.append(key, fieldValue)
    })

    console.log(data)

    setLoading(true)
    setSuccess(false)
    setError(false)

    submitRequest(data)
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
    <div className={styles.contentForm}>
      <form name="content-form" onSubmit={onSubmit}>
        {props.type.publishing.draftMode && <div className="draft input-group">
          <label>Draft</label>
          <Toggle value={state['draft']} onChange={handleFieldChange('draft')} />
          { state.draft && <div>Your content will not be visible</div>}
        </div>}
        {/* {JSON.stringify(props.type)} */}
        {props.type.fields.map((field) => (
          <DynamicField
            key={field.name}
            field={field}
            value={state[field.name]}
            onChange={handleFieldChange(field.name)}
          />
        ))}

        <div className={styles.actions}>
          <Button alt={true} type="submit">
            Save
          </Button>
        </div>
      </form>

      {loading && <div className="loading">Loading...</div>}
      {success && <div className="success">Saved</div>}
      {error && <div className="error">Error saving </div>}
    </div>
  )
}
