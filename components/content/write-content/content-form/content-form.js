import API from '../../../../lib/api/api-endpoints'
import Button from '../../../generic/button/button'
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
//       defaultValue={props.value}
    />
  )
}

function InputTags(props) {
  return (
    <input
      type="text"
      className={styles.inputText}
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
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
    ></textarea>
  )
}

function Field(props) {
  const getInput = (field) => {
    switch (field.type) {
      case 'textarea':
        return <TextArea field={field} value={props.value} />

      case 'img':
        return <InputImage field={field}  value={props.value} />

      case 'number':
        return <InputNumber field={field}  value={props.value} />

      case 'file':
        return <InputFile field={field}  value={props.value} />

      case 'tags':
        return <InputTags field={field}  value={props.value} />

      default:
        return <InputText field={field}  value={props.value} />
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

    const data = new URLSearchParams()
    props.type.fields.forEach((field) => {
      const fieldValue = ev.target[field.name].value
      // TODO: Do client side validations
      data.append(field.name, fieldValue)
    })

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

    console.log(data)
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
          <Field field={field} value={props.content ? props.content[field.name] : null}/>
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
