import { FieldType, GroupEntityType, GroupTypeDefinition } from '@lib/types'
import React, { memo, useCallback, useEffect, useState } from 'react'

import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import DynamicField from '@components/generic/dynamic-field/dynamic-field-edit'
import { FIELDS } from '@lib/constants'
import GroupSummaryView from '../../read/group-summary-view/group-summary-view'
import Link from 'next/link'
import SEOForm from '@components/content/write-content/content-form/seo-form'
import { SEOPropertiesType } from '@lib/types/seo'
import Toggle from '@components/generic/toggle/toggle'
import fetch from '@lib/fetcher'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

type Props = {
  type: GroupTypeDefinition
  group: Partial<GroupEntityType>
  permittedFields: FieldType[]
  onSave: (result) => void
}

function GroupForm({ type, group, onSave, permittedFields }: Props) {
  // Saving states
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)


  const defaultSeoOptions: SEOPropertiesType = {
    slug: '',
    title: '',
    description: ''
  }
  
  const [state, setState] = useState<Partial<GroupEntityType>>({
    seo: defaultSeoOptions
  })

  useEffect(() => {
    // Preload the form values
    if (type && group) {
      const filteredData = {}
      // We filter the data that comes from the API into the state, because we don't want to send to the PUT and POST request
      // additional information
      const allowedKeys = permittedFields
        .map((f) => f.name)
        .concat('draft', 'members', 'seo')

      allowedKeys.map((k) => {
        filteredData[k] = group[k]
      })

      setState({
        ...filteredData,
        seo: {
          ...defaultSeoOptions,
          ...(filteredData['seo'] || {})
        }
      })
    }
  }, [group, type])

  // Store the fields
  const handleFieldChange = useCallback(
    (name) => (value) => {
      setState((prevState) => ({ ...prevState, [name]: value }))
    },
    [setState]
  )

  const submitRequest = (data, jsonData) => {
    const url = `${API.groups[type.slug]}${
      group.id ? '/' + group.id + '?field=id' : ''
    }`

    return fetch(url, {
      method: group.id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...jsonData,
        // Clean the members data that we are storing to only send the id and group role
        members: jsonData.members
          ? jsonData.members.map((member) => ({
              id: member.id,
              roles: member.roles,
            }))
          : [],
      }),
    }).then((result) => {
      // Files are always updated as a PUT
      return fetch(`${API.groups[type.slug]}${'/' + result.id + '?field=id'}`, {
        method: 'PUT',
        body: data,
      })
    })
  }

  const onSubmit = () => {
    const formData = new FormData()
    const jsonData = {}

    // Build the JSON data object and the formdata for the files.
    Object.keys(state).forEach((key) => {
      const fieldValue = state[key]
      const fieldDefinition = permittedFields.find((t) => t.name === key)

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

        if (onSave) {
          onSave(result)
        }
      })
      .catch((err) => {
        setLoading(false)
        setSuccess(false)
        setError(true)
      })
  }

  const { executeRecaptcha } = useGoogleReCaptcha()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = await executeRecaptcha('login_page')

    if (token) {
      onSubmit()
    }
  }

  // It needs the type definition
  if (!type) {
    return <p>Missing type definition</p>
  }

  return (
    <>
      <div className="group-form contentForm">
        <form name="group-form" onSubmit={handleSubmit}>
          {type.publishing.draftMode && (
            <div className="draft input-group">
              <label>Draft</label>
              <Toggle
                value={state['draft']}
                onChange={handleFieldChange('draft')}
              />
            </div>
          )}

          {permittedFields.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              value={state[field.name]}
              onChange={handleFieldChange(field.name)}
            />
          ))}

          <SEOForm value={state.seo} onChange={(val) => setState({
            ...state,
            seo: val
          })} />

          <div className="actions">
            <Button title="Save" loading={loading} alt type="submit">
              Save
            </Button>
          </div>
          {success && (
            <div className="success-message">
              Saved: You can see it{' '}
              <Link href={`/group/${type.slug}/${group.seo.slug}`}>
                <a title="View Content">here</a>
              </Link>
            </div>
          )}
          {error && <div className="error-message">Error saving </div>}
        </form>

        <div className="preview-wrapper">
          <div className="preview">
            <GroupSummaryView group={state} type={type} linkToDetail={false} />
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .group-form {
            align-items: flex-start;
            background: var(--edge-background);
            border-radius: 8px;
            box-shadow: var(--shadow-smallest);
            display: flex;
            justify-content: space-between;
            padding: var(--edge-gap);
            margin: 40px 0 24px;
          }

          .group-form form {
            width: 50%;
          }

          .preview-wrapper {
            position: sticky;
            top: 120px;
            width: 40%;
          }

          @media all and (max-width: 960px) {
            .preview-wrapper {
              display: none;
            }

            .contentForm form {
              width: 100%;
            }
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

export default memo(GroupForm)
