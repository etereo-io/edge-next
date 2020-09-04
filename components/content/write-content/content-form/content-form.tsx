import { useEffect, useState, memo, useCallback } from 'react'

import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import Card from '@components/generic/card/card'
import ContentSummaryView from '../../read-content/content-summary-view/content-summary-view'
import DynamicField from '@components/generic/dynamic-field/dynamic-field-edit'
import { FIELDS } from '@lib/constants'
import GroupSummaryView from '@components/groups/read/group-summary-view/group-summary-view'
import Link from 'next/link'
import Toggle from '@components/generic/toggle/toggle'
import fetch from '@lib/fetcher'

function ContentForm(props) {
  // Saving states
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  // used to store values
  const [state, setState] = useState({})

  useEffect(() => {
    // Preload the form values
    if (props.type && props.content) {
      const filteredData = {}
      // We filter the data that comes from the API into the state, because we don't want to send to the PUT and POST request
      // additional information
      const allowedKeys = props.permittedFields
        .map((f) => f.name)
        .concat('draft')

      allowedKeys.map((k) => {
        filteredData[k] = props.content[k]
      })

      setState(filteredData)
    }
  }, [props.content, props.type])

  // Store the fields
  const handleFieldChange = useCallback(
    (name) => (value) => {
      setState((prevState) => ({ ...prevState, [name]: value }))
    },
    [setState]
  )

  const submitRequest = (data, jsonData) => {
    const groupParamsString = props.group
      ? `groupId=${props.group.id}&groupType=${props.group.type}`
      : ''
    const url = `${API.content[props.type.slug]}${
      props.content.id
        ? `/${props.content.id}?field=id&${groupParamsString}`
        : `?${groupParamsString}`
    }`

    return fetch(url, {
      method: props.content.id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    }).then((result) => {
      // Files are always updated as a PUT
      return fetch(
        `${API.content[props.type.slug]}${'/' + result.id + '?field=id'}`,
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
    // Separate JsonDATA for normal data and formData for files
    Object.keys(state).forEach((key) => {
      const fieldValue = state[key]
      const fieldDefinition = props.permittedFields.find((t) => t.name === key)

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
      <div className="contentForm">
        <form name="content-form" onSubmit={onSubmit}>
          {props.type.publishing.draftMode && (
            <div className="draft input-group">
              <label>Draft</label>
              <Toggle
                value={state['draft']}
                onChange={handleFieldChange('draft')}
              />
            </div>
          )}

          {props.permittedFields.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              value={state[field.name]}
              onChange={handleFieldChange(field.name)}
            />
          ))}

          <div className="actions">
            <Button loading={loading} alt={true} type="submit">
              Save
            </Button>
          </div>
          {success && (
            <div className="success-message">
              Saved: You can see it{' '}
              <Link href={`/content/${props.type.slug}/${props.content.slug}`}>
                <a title="View content">here</a>
              </Link>
            </div>
          )}
          {error && <div className="error-message">Error saving </div>}
        </form>

        <div className="preview-wrapper">
          <div className="preview">
            <ContentSummaryView
              content={state}
              type={props.type}
              user={props.currentUser}
            />
          </div>
          {props.group && (
            <Card>
              <GroupSummaryView
                group={props.group}
                linkToDetail={true}
                type={props.groupType}
              />
            </Card>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .contentForm {
            align-items: flex-start;
            background: var(--edge-background);
            box-shadow: var(--shadow-smallest);
            display: flex;
            justify-content: space-between;
            padding: var(--edge-gap);
          }

          .contentForm form {
            width: 50%;
          }

          .preview-wrapper {
            position: sticky;
            top: 72px;
            width: 40%;
          }

          .preview {
            border-radius: 4px;
            box-shadow: var(--shadow-large);
            padding: var(--edge-gap);
            margin-bottom: var(--edge-gap);
          }

          .actions {
            padding-top: var(--edge-gap);
          }
        `}
      </style>
    </>
  )
}

export default memo(ContentForm)
