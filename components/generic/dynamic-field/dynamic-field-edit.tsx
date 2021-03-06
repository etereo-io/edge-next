import {
  InputDate,
  InputDateTime,
  InputEmails,
  InputEntity,
  InputFile,
  InputImage,
  InputNumber,
  InputTags,
  InputTel,
  InputText,
  InputTime,
  InputUrl,
  Radio,
  RichEditor,
  Select,
  TextArea,
} from './fields'
import { memo, useCallback, useState } from 'react'

import { FIELDS } from '@lib/constants'
import Toggle from '../toggle/toggle'

function Field(props) {
  const [error, setError] = useState(false)
  const { onChange: onChangeHandler } = props

  const onChange = useCallback(
    (value: any, isValid?: boolean) => {
      if (typeof isValid !== 'undefined') {
        setError(!isValid)
      }

      onChangeHandler(value)
    },
    [setError, onChangeHandler]
  )

  const getInput = (field) => {
    const datatestId = `${field.type}-${field.name}`
    switch (field.type) {
      case FIELDS.TEXTAREA:
        return (
          <TextArea
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.MARKDOWN:
        return (
          <TextArea
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.IMAGE:
        return (
          <InputImage
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.NUMBER:
        return (
          <InputNumber
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.TEL:
        return (
          <InputTel
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.URL:
        return (
          <InputUrl
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )
      case FIELDS.TIME:
        return (
          <InputTime
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )
      case FIELDS.DATETIME:
        return (
          <InputDateTime
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      
      case FIELDS.DATE:
        return (
          <InputDate
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.BOOLEAN:
        return (
          <Toggle
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.FILE:
        return (
          <InputFile
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.TAGS:
        return (
          <InputTags
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )
      case FIELDS.EMAILS:
        return (
          <InputEmails
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )
      case FIELDS.SELECT:
        return (
          <Select
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.RADIO:
        return (
          <Radio
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.VIDEO_URL:
        return (
          <InputText
            field={field}
            value={props.value}
            disabled={props.disabled}
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
            disabled={props.disabled}
            value={JSON.stringify(props.value)}
            data-testid={datatestId}
          />
        )

      case FIELDS.ENTITY_SEARCH:
        return (
          <InputEntity
            field={field}
            value={props.value}
            disabled={props.disabled}
            data-testid={datatestId}
            onChange={onChange}
          />
        )

      case FIELDS.RICH_TEXT:
        return (
          <RichEditor field={field} value={props.value} onChange={onChange} />
        )

      default:
        return (
          <InputText
            field={field}
            value={props.value}
            disabled={props.disabled}
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
        <label htmlFor={props.field.name}>{props.field.label}</label>
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

      <style global jsx>
        {`
          .error .quill .ql-toolbar {
            border: 1px solid red;
          }

          .error .quill .ql-container {
            border: 1px solid red;
          }

          .description {
            color: var(--accents-3);
            font-size: 12px;
          }
        `}
      </style>
    </div>
  )
}

export default memo(Field)
