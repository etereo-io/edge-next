import fetch from 'isomorphic-unfetch'

function checkStatus(response) {
  if (response.ok) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    return Promise.reject(error)
  }
}

export default function (url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then((r) => r.json())
    .then((data) => {
      console.log(data)
      return data
    })
}
