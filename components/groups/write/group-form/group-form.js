import { useEffect, useState } from 'react'

import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import DynamicField from '@components/generic/dynamic-field/dynamic-field-edit'
import Toggle from '@components/generic/toggle/toggle'
import fetch from '@lib/fetcher'
import { FIELDS } from '@lib/constants'
import GroupSummaryView from '../../read/group-summary-view/group-summary-view'
import Link from 'next/link'

export default function (props) {

  // Saving states
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  // used to store values
  const [state, setState] = useState({})

  useEffect(() => {
    // Preload the form values
    if (props.type && props.group) {
      const filteredData = {}
      // We filter the data that comes from the API into the state, because we don't want to send to the PUT and POST request
      // additional information
      const allowedKeys = props.type.fields.map((f) => f.name).concat('draft', 'members')

      allowedKeys.map((k) => {
        filteredData[k] = props.group[k]
      })

      setState(filteredData)
    }
  }, [props.group, props.type])

  // Store the fields
  const handleFieldChange = (name) => (value) => {
    setState({
      ...state,
      [name]: value,
    })
  }

  const submitRequest = (data, jsonData) => {
    const url = `${API.groups[props.type.slug]}${
      props.group.id ? '/' + props.group.id + '?field=id' : ''
    }`

    return fetch(url, {
      method: props.group.id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...jsonData,
        // Clean the members data that we are storing to only send the id and group role
        members: jsonData.members ? jsonData.members.map(member => ({ id: member.id, roles: member.roles})) : []
      }),
    }).then((result) => {
      // Files are always updated as a PUT
      return fetch(
        `${API.groups[props.type.slug]}${'/' + result.id + '?field=id'}`,
        {
          method: 'PUT',
          body: data,
        }
      )
    })
  }

  const onSubmit = (ev) => {
    ev.preventDefault()

    const formData = new FormData()
    const jsonData = {}

    // Build the JSON data object and the formdata for the files.
    Object.keys(state).forEach((key) => {
      const fieldValue = state[key]
      const fieldDefinition = props.type.fields.find((t) => t.name === key)

      if (
        fieldDefinition &&
        (fieldDefinition.type === FIELDS.IMAGE ||
          fieldDefinition.type === FIELDS.FILE)
      ) {
        if (fieldValue && fieldValue.length > 0) {
          jsonData[key] = []

          fieldValue.forEach((item) => {
            if (item.isFile) {
              // Append each new file to the formData to be uploaded
              formData.append(key, item.file)
            } else {

              // If it is a file that is already uploaded before, keep it on the json data
              jsonData[key] = jsonData[key] ? [...jsonData[key], item] : [item]
            }
          })
        } else {
          jsonData[key] = []
        }
      } else {
        jsonData[key] = fieldValue
      }
    })

    setLoading(true)
    setSuccess(false)
    setError(false)

    submitRequest(formData, jsonData)
      .then((result) => {
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
      })
  }

  // It needs the type definition
  if (!props.type) {
    return <p>Missing type definition</p>
  }

  return (
    <>
      <div className="group-form">
        <form name="group-form" onSubmit={onSubmit}>
          {props.type.publishing.draftMode && (
            <div className="draft input-group">
              <label>Draft</label>
              <Toggle
                value={state['draft']}
                onChange={handleFieldChange('draft')}
              />
            </div>
          )}

          {props.type.fields.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              value={state[field.name]}
              onChange={handleFieldChange(field.name)}
            />
          ))}

          <h2>User permissions</h2>

          <div className="actions">
            <Button loading={loading} alt={true} type="submit">
              Save
            </Button>
          </div>
          {success && (
            <div className="success-message">
              Saved: You can see it{' '}
              <Link href={`/group/${props.type.slug}/${props.group.slug}`}>
                <a title="View Content">here</a>
              </Link>
            </div>
          )}
          {error && <div className="error-message">Error saving </div>}
        </form>

        <div className="preview">
          <GroupSummaryView group={state} type={props.type} linkToDetail={false}/>
        </div>
      </div>
      <style jsx>
        {`
          .group-form {
            align-items: flex-start;
            background: var(--edge-background);
            box-shadow: var(--shadow-smallest);
            display: flex;
            justify-content: space-between;
            padding: var(--edge-gap);
          }

          .group-form form {
            width: 50%;
          }

          .preview {
            border-radius: 4px;
            box-shadow: var(--shadow-large);
            padding: var(--edge-gap);
            position: sticky;
            top: 72px;
            width: 40%;
          }

          .actions {
            padding-top: var(--edge-gap);
          }
        `}
      </style>
    </>
  )
}
