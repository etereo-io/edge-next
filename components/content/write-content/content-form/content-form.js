import API from '../../../../lib/api-endpoints'
import fetch from 'isomorphic-unfetch'

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

  return (
    <div className="content-form">
      <form onSubmit={onSubmit} >
        {JSON.stringify(props.type)}
      </form>
    </div>
  )
}