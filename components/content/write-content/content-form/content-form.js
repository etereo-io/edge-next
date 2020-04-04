import API from '../../../../lib/api-endpoints'
import fetch from 'isomorphic-unfetch'


function InputText(props) {
  return (
    <input type="text" name={props.field.name} placeholder={props.field.placeholder} value={props.field.value} />
  )
}

function InputNumber(props) {
  return (
    <input type="number" name={props.field.name} placeholder={props.field.placeholder} value={props.field.value} />
  )
}

function InputImage(props) {
  return (
    <input type="file" accept="image/png, image/jpeg" name={props.field.name} placeholder={props.field.placeholder} value={props.field.value} />
  )
}

function InputFile(props) {
  return (
    <input type="file" accept="image/png, image/jpeg" name={props.field.name} placeholder={props.field.placeholder} value={props.field.value} />
  )
}

function InputTags(props) {
  return (
    <input type="text" name={props.field.name} placeholder={props.field.placeholder} value={props.field.value} />
  )
}

function TextArea(props) {
  return (
    <textarea name={props.field.name} placeholder={props.field.placeholder} value={props.field.value}></textarea>
  )
}

function Field(props) {
  
  const getInput = (field) => {
    switch(field.type) {
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
      { props.field.label && (<label>{props.field.label}</label>) }
      { getInput(props.field)}
    </div>
  )
}

export default function (props) {

  const submitRequest = data => {
    const url = API.content[props.type.slug]
    fetch(url, {
      method: 'post',
      body: data,
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*'
      }),
    })
    .then(() => {
      // Trigger on save
    })
    .catch(err => {
      // SHOW ERROR
    })
  }
  
  const onSubmit = () => {

  }

  // It needs the type definition
  if (!props.type) {
    return (<p>Missing type definition</p>)
  }

  return (
    <div className="content-form">
      <form onSubmit={onSubmit} >
        {/* {JSON.stringify(props.type)} */}
        {props.type.fields.map(field => <Field field={field} />)}
      </form>
    </div>
  )
}