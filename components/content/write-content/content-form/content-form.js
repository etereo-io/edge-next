import API from '../../../../lib/api/api-endpoints'
import fetch from '../../../../lib/fetcher'
import Button from '../../../button/button'
import './content-form.scss'

import { useState } from 'react'

function InputText(props) {
  return (
    <input
      type="text"
      name={props.field.name}
      placeholder={props.field.placeholder}
      value={props.field.value}
    />
  )
}

function InputNumber(props) {
  return (
    <input
      type="number"
      name={props.field.name}
      placeholder={props.field.placeholder}
      value={props.field.value}
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
      value={props.field.value}
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
      value={props.field.value}
    />
  )
}

function InputTags(props) {
  return (
    <input
      type="text"
      name={props.field.name}
      placeholder={props.field.placeholder}
      value={props.field.value}
    />
  )
}

function TextArea(props) {
  return (
    <textarea
      name={props.field.name}
      placeholder={props.field.placeholder}
      value={props.field.value}
    ></textarea>
  )
}

function Field(props) {
  const getInput = (field) => {
    switch (field.type) {
      case 'textarea':
        return <TextArea field={field} />

      case 'img':
        return <InputImage field={field} />

      case 'number':
        return <InputNumber field={field} />

      case 'file':
        return <InputFile field={field} />

      case 'tags':
        return <InputTags field={field} />

      default:
        return <InputText field={field} />
    }
  }

  return (
    <div className="field-item">
      <div className="label-zone">
        {props.field.label && <label>{props.field.label}</label>}
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
    const url = API.content[props.type.slug]
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
    <div className="content-form">
      <form name="content-form" onSubmit={onSubmit}>
        {/* {JSON.stringify(props.type)} */}
        {props.type.fields.map((field) => (
          <Field field={field} />
        ))}

        <div className="actions">
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
