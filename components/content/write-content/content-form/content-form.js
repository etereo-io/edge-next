import API from '../../../../lib/api/api-endpoints'
import Button from '../../../generic/button/button'
import TagsField from '../../../generic/tags-input/tags-input'
import fetch from '../../../../lib/fetcher'
import styles from './content-form.module.scss'
import { useState } from 'react'

function InputText(props) {
  return (
    <input
      type="text"
      className={styles.inputText}
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      onChange={(ev) => props.onChange(ev.target.value)}
    />
  )
}

function InputNumber(props) {
  return (
    <input
      type="number"
      className={styles.inputText}
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      onChange={(ev) => props.onChange(ev.target.value)}
    />
  )
}

function InputImage(props) {
  return (
    <input
      type="file"
      accept="image/png, image/jpeg"
      name={props.field.name}
      placeholder={props.field.placeholder}
      onChange={(ev) => props.onChange(ev.target.value)}
      // defaultValue={props.value}
    />
  )
}

function InputFile(props) {
  return (
    <input
      type="file"
      accept="image/png, image/jpeg"
      name={props.field.name}
      placeholder={props.field.placeholder}
      onChange={(ev) => props.onChange(ev.target.value)}
//       defaultValue={props.value}
    />
  )
}

function InputTags(props) {
  return (
    <TagsField 
      placeholder={props.field.placeholder}
      name={props.field.name}
      onChange={(val) => props.onChange(val)}
      />
  )
}

function TextArea(props) {
  return (
    <textarea
      className={styles.textarea}
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      onChange={(ev) => props.onChange(ev.target.value)}
    ></textarea>)
}

function Field(props) {
  const getInput = (field) => {
    switch (field.type) {
      case 'textarea':
        return <TextArea field={field} value={props.value} onChange={props.onChange} />

      case 'img':
        return <InputImage field={field}  value={props.value} onChange={props.onChange}/>

      case 'number':
        return <InputNumber field={field}  value={props.value} onChange={props.onChange}/>

      case 'file':
        return <InputFile field={field}  value={props.value} onChange={props.onChange}/>

      case 'tags':
        return <InputTags field={field}  value={props.value} onChange={props.onChange}/>

      default:
        return <InputText field={field}  value={props.value} onChange={props.onChange}/>
    }
  }

  return (
    <div className={styles['field-item']}>
      <div className="label-zone">
        {props.field.label && <label className={styles['label-zoneLabel']}>{props.field.label}</label>}
      </div>
      <div className="input-zone">{getInput(props.field)}</div>
    </div>
  )
}

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
    defaultState[field.name] = props.content ? props.content[field.name] : fieldValue
  })

  const [state, setState] = useState(defaultState)

  // Generic field change
  const handleFieldChange = name => (value) => {
    console.log(name, value)
    setState({
      ...state,
      [name]: value
    })
  }

  const submitRequest = (data) => {
    const url = `${API.content[props.type.slug]}${props.content ? '/' + props.content.id + '?field=id' : ''}`
    
    return fetch(url, {
      method:'post',
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
        {/* {JSON.stringify(props.type)} */}
        {props.type.fields.map((field) => (
          <Field key={field.name} field={field} value={state[field.name]} onChange={handleFieldChange(field.name)}/>
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
