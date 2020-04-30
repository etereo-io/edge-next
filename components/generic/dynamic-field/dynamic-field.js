import TagsField from '../tags-input/tags-input'

function InputText(props) {
  return (
    <input
      type="text"
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      required={!!props.field.required}
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
      required={!!props.field.required}
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
      required={!!props.field.required}
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
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      required={!!props.field.required}
      onChange={(ev) => props.onChange(ev.target.value)}
    ></textarea>
  )
}

function Field(props) {
  const getInput = (field) => {
    switch (field.type) {
      case 'textarea':
        return (
          <TextArea
            field={field}
            value={props.value}
            onChange={props.onChange}
          />
        )

      case 'img':
        return (
          <InputImage
            field={field}
            value={props.value}
            onChange={props.onChange}
          />
        )

      case 'number':
        return (
          <InputNumber
            field={field}
            value={props.value}
            onChange={props.onChange}
          />
        )

      case 'file':
        return (
          <InputFile
            field={field}
            value={props.value}
            onChange={props.onChange}
          />
        )

      case 'tags':
        return (
          <InputTags
            field={field}
            value={props.value}
            onChange={props.onChange}
          />
        )

      case 'select':
          return (
            <div className="input-select">
              <select name={field.name} onChange={props.onChange} value={props.value}>
                {field.options.map(o => <option value={o.value}>{o.label}</option>)}
              </select>
            </div>
          )

      case 'radio':
        return (
          <div className="input-radio-group">
              
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
      
      case 'json':
        return (
          <textarea name={field.name} onChange={props.onChange} value={JSON.stringify(props.value)}>
            
          </textarea>
          )

      default:
        return (
          <InputText
            field={field}
            value={props.value}
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
