import { FIELDS } from '../../../lib/config/config-constants'
import TagsField from '../tags-input/tags-input'
import Toggle from '../toggle/toggle'

function InputText(props) {
  return (
    <input
      type="text"
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      data-testid={props['data-testid']}
      required={!!props.field.required}
      minLength={typeof props.field.minlength !== 'undefined' ? props.field.minlength: null}
      maxLength={typeof props.field.maxlength !== 'undefined' ? props.field.maxlength: null}
      pattern={props.field.pattern ? props.field.pattern: null}
      onChange={(ev) => props.onChange(ev.target.value)}
    />
  )
}

function InputNumber(props) {
  return (
    <input
      type="number"
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      required={!!props.field.required}
      data-testid={props['data-testid']}
      min={typeof props.field.min !== 'undefined' ? props.field.min: null}
      max={typeof props.field.max !== 'undefined' ? props.field.max: null}
      onChange={(ev) => props.onChange(ev.target.value)}
    />
  )
}

function InputImage(props) {
  return (
    <input
      type="file"
      accept={props.field.accept ? props.field.accept : 'image/png, image/jpeg'}
      name={props.field.name}
      required={!!props.field.required}
      placeholder={props.field.placeholder}
      multiple={!!props.field.multiple}
      data-testid={props['data-testid']}
      onChange={(ev) => props.onChange(ev.target.value)}
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
      required={!!props.field.required}
      multiple={!!props.field.multiple}
      capture={props.field.capture ? props.field.capture: null}
      data-testid={props['data-testid']}
      onChange={(ev) => props.onChange(ev.target.value)}
    />
  )
}

function InputTags(props) {
  return (
    <TagsField
      placeholder={props.field.placeholder}
      name={props.field.name}
      value={props.value}
      data-testid={props['data-testid']}
      onChange={(val) => props.onChange(val)}
    />
  )
}

function TextArea(props) {
  return (
    <textarea
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      data-testid={props['data-testid']}
      required={!!props.field.required}
      minLength={typeof props.field.minlength !== 'undefined' ? props.field.minlength: null}
      maxLength={typeof props.field.maxlength !== 'undefined' ? props.field.maxlength: null}
      onChange={(ev) => props.onChange(ev.target.value)}
    ></textarea>
  )
}

function Field(props) {
  const getInput = (field) => {
    const datatestId = `${field.type}-${field.name}`
    switch (field.type) {
      case FIELDS.TEXTAREA:
        return (
          <TextArea
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={props.onChange}
          />
        )

      case FIELDS.IMAGE:
        return (
          <InputImage
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={props.onChange}
          />
        )

      case FIELDS.NUMBER:
        return (
          <InputNumber
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={props.onChange}
          />
        )

      case FIELDS.BOOLEAN:
        return (
          <Toggle
            value={props.value}
            data-testid={datatestId}
            onChange={props.onChange}
          />
        )

      case FIELDS.FILE:
        return (
          <InputFile
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={props.onChange}
          />
        )

      case FIELDS.TAGS:
        return (
          <InputTags
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={props.onChange}
          />
        )

      case FIELDS.SELECT:
          return (
            <div className="input-select">
              <select data-testid={datatestId} name={field.name} onChange={props.onChange} value={props.value}>
                {field.options.map(o => <option value={o.value}>{o.label}</option>)}
              </select>
            </div>
          )

      case FIELDS.RADIO:
        return (
          <div className="input-radio-group" data-testid={datatestId}>
              
              {field.options.map(o => {
                return (
                  <div className="input-radio" key={o.label}>
                    <input
                      type="radio"
                      id={o.label}
                      value={o.value}
                      name={field.name}
                    ></input>
                    <label for={o.label}>{o.label}</label>
                  </div>
                )
              })}
            </div>
        )
      
      case FIELDS.JSON:
        return (
          <textarea name={field.name} onChange={props.onChange} value={JSON.stringify(props.value)} data-testid={datatestId}>
            
          </textarea>
          )

      default:
        return (
          <InputText
            field={field}
            value={props.value}
            data-testid={datatestId}
            onChange={props.onChange}
          />
        )
    }
  }

  return (
    <div className={`input-group ${props.field.required ? 'required': ''}`}>
      
      {props.field.label && (
        <label forName={props.field.name}>{props.field.label}</label>
      )}
      
      {getInput(props.field)}
    </div>
  )
}

export default Field
