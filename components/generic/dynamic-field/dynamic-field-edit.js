import { FIELDS } from '@lib/config/config-constants'
import TagsInput from '../tags-input/tags-input'
import Toggle from '../toggle/toggle'
import Upload from '../upload/upload'
import { useState } from 'react'

function InputText(props) {
  const [touched, setTouched] = useState(false)
  const onChange = (ev) => {
    setTouched(true)
    props.onChange(ev.target.value, ev)
  }

  return (
    <input
      type="text"
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      data-testid={props['data-testid']}
      required={!!props.field.required}
      minLength={
        typeof props.field.minlength !== 'undefined'
          ? props.field.minlength
          : null
      }
      maxLength={
        typeof props.field.maxlength !== 'undefined'
          ? props.field.maxlength
          : null
      }
      pattern={props.pattern || null}
      className={`${touched ? 'touched' : ''}`}
      onChange={onChange}
    />
  )
}

function InputTel(props) {
  const [touched, setTouched] = useState(false)
  const onChange = (ev) => {
    setTouched(true)
    props.onChange(ev.target.value, ev)
  }

  return (
    <input
      type="tel"
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      data-testid={props['data-testid']}
      required={!!props.field.required}
      pattern={props.pattern || null}
      className={`${touched ? 'touched' : ''}`}
      onChange={onChange}
    />
  )
}

function InputDate(props) {
  const [touched, setTouched] = useState(false)
  const onChange = (ev) => {
    setTouched(true)
    props.onChange(ev.target.value, ev)
  }

  return (
    <input
      type="date"
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      data-testid={props['data-testid']}
      required={!!props.field.required}
      min={typeof props.field.min !== 'undefined' ? props.field.min : null}
      max={typeof props.field.max !== 'undefined' ? props.field.max : null}
      className={`${touched ? 'touched' : ''}`}
      onChange={onChange}
    />
  )
}

function InputUrl(props) {
  const [touched, setTouched] = useState(false)
  const onChange = (ev) => {
    setTouched(true)
    props.onChange(ev.target.value, ev)
  }

  return (
    <input
      type="url"
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      data-testid={props['data-testid']}
      required={!!props.field.required}
      minLength={
        typeof props.field.minlength !== 'undefined'
          ? props.field.minlength
          : null
      }
      maxLength={
        typeof props.field.maxlength !== 'undefined'
          ? props.field.maxlength
          : null
      }
      pattern={props.pattern || null}
      className={`${touched ? 'touched' : ''}`}
      onChange={onChange}
    />
  )
}

function InputNumber(props) {
  const [touched, setTouched] = useState(false)
  const onChange = (ev) => {
    setTouched(true)
    props.onChange(ev.target.value, ev)
  }

  return (
    <input
      type="number"
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      required={!!props.field.required}
      data-testid={props['data-testid']}
      min={typeof props.field.min !== 'undefined' ? props.field.min : null}
      max={typeof props.field.max !== 'undefined' ? props.field.max : null}
      className={`${touched ? 'touched' : ''}`}
      onChange={onChange}
    />
  )
}

function Select(props) {
  const [touched, setTouched] = useState(false)
  const onChange = (ev) => {
    setTouched(true)
    props.onChange(ev.target.value, ev)
  }

  return (
    <div className="input-select">
      <select
        data-testid={props['data-testid']}
        name={props.field.name}
        className={`${touched ? 'touched' : ''}`}
        onChange={onChange}
        value={props.value}
      >
        {props.field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function Radio(props) {
  const [touched, setTouched] = useState(false)
  const value = props.field.multiple ? (props.value || []) : props.value

  const onChange = (ev) => {
    setTouched(true)
    const isChecked = ev.target.checked
    const itemValue = ev.target.value
    let newValues = value

    if (props.field.multiple) {
      if (isChecked) {
        newValues = [...newValues, itemValue]
      } else {
        newValues = [...newValues.filter(i => i !==itemValue)]
      }
    } else {
      newValues = itemValue
    }

    
    props.onChange(newValues, ev)
  }

  return (
    <div
      className="input-radio-group"
      data-testid={props['data-testid']}
      className={`${touched ? 'touched' : ''}`}
    >
      {props.field.options.map((o) => {
        return (
          <div className="input-radio" key={o.label}>
            <input
              type={props.field.multiple ? 'checkbox': 'radio'}
              id={props['data-testid'] + o.value}
              key={props['data-testid'] + o.value}
              value={o.value}
              checked={props.field.multiple ? value.indexOf(o.value) !== -1 : value === o.value}
              name={props.field.name}
              onChange={onChange}
            ></input>
            <label for={props['data-testid'] + o.value}>{o.label}</label>
          </div>
        )
      })}
    </div>
  )
}

function InputImage(props) {
  const [touched, setTouched] = useState(false)

  const onChange = (files) => {
    setTouched(true)
    props.onChange(files)
  }

  return (
    <>
      <Upload
        accept={
          props.field.accept ? props.field.accept : 'image/png, image/jpeg'
        }
        name={props.field.name}
        required={!!props.field.required}
        multiple={!!props.field.multiple}
        data-testid={props['data-testid']}
        className={`${touched ? 'touched' : ''}`}
        value={props.value}
        description={
          props.field.multiple
            ? 'Upload multiple images to display a carousel'
            : 'Upload a single image'
        }
        onChange={onChange}
      />
    </>
  )
}

function InputFile(props) {
  const [touched, setTouched] = useState(false)
  const onChange = (files) => {
    setTouched(true)
    props.onChange(files)
  }

  return (
    <Upload
      accept={props.field.accept ? props.field.accept : 'image/png, image/jpeg'}
      name={props.field.name}
      required={!!props.field.required}
      multiple={!!props.field.multiple}
      capture={props.field.capture ? props.field.capture : null}
      data-testid={props['data-testid']}
      className={`${touched ? 'touched' : ''}`}
      value={props.value}
      description={
        props.field.multiple
          ? 'You can upload multiple files'
          : 'Upload a single file'
      }
      onChange={onChange}
    />
  )
}

function InputTags(props) {
  return (
    <TagsInput
      placeholder={props.field.placeholder}
      name={props.field.name}
      value={props.value}
      data-testid={props['data-testid']}
      onChange={(val) => props.onChange(val)}
    />
  )
}

function TextArea(props) {
  const [touched, setTouched] = useState(false)
  const onChange = (ev) => {
    setTouched(true)
    props.onChange(ev.target.value, ev)
  }

  return (
    <textarea
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      data-testid={props['data-testid']}
      required={!!props.field.required}
      minLength={
        typeof props.field.minlength !== 'undefined'
          ? props.field.minlength
          : null
      }
      maxLength={
        typeof props.field.maxlength !== 'undefined'
          ? props.field.maxlength
          : null
      }
      className={`${touched ? 'touched' : ''}`}
      onChange={onChange}
    ></textarea>
  )
}

function Field(props) {
  const [error, setError] = useState(false)

  const onChange = (value, ev) => {
    if (ev) {
      const valid = ev.target.checkValidity()
      setError(!valid)
    }

    props.onChange(value)
  }

  const getInput = (field) => {
    const datatestId = `${field.type}-${field.name}`
    switch (field.type) {
      case FIELDS.TEXTAREA:
        return (
          <TextArea
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.MARKDOWN:
        return (
          <TextArea
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.IMAGE:
        return (
          <InputImage
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.NUMBER:
        return (
          <InputNumber
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.TEL:
        return (
          <InputTel
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.URL:
        return (
          <InputUrl
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.DATE:
        return (
          <InputDate
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.BOOLEAN:
        return (
          <Toggle
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.FILE:
        return (
          <InputFile
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.TAGS:
        return (
          <InputTags
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.SELECT:
        return (
          <Select
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.RADIO:
        return (
          <Radio
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.VIDEO_URL:
        return (
          <InputText
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
            pattern={'https?://.+'}
          />
        )

      case FIELDS.JSON:
        return (
          <textarea
            name={field.name}
            onChange={onChange}
            value={JSON.stringify(props.value)}
            data-testid={datatestId}
          ></textarea>
        )

      default:
        return (
          <InputText
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={onChange}
            pattern={field.pattern ? field.pattern : null}
          />
        )
    }
  }

  return (
    <div
      className={`input-group ${props.field.required ? 'required' : ''} ${
        error ? 'error' : ''
      }`}
    >
      {props.field.label && (
        <label forname={props.field.name}>{props.field.label}</label>
      )}

      {getInput(props.field)}

      {props.field.description && (
        <span className="description">{props.field.description}</span>
      )}

      {error && (props.field.errorMessage || props.errorMessage) && (
        <div className="error-message">
          {props.field.errorMessage || props.errorMessage}
        </div>
      )}
    </div>
  )
}

export default Field
