import React, { memo, useCallback, useEffect, useState } from 'react'

import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import Card from '@components/generic/card/card'
import ContentSummaryView from '../../read-content/content-summary-view/content-summary-view'
import DynamicField from '@components/generic/dynamic-field/dynamic-field-edit'
import { FIELDS } from '@lib/constants'
import GroupSummaryView from '@components/groups/read/group-summary-view/group-summary-view'
import Link from 'next/link'
import { PurchashingOptionsType } from '@lib/types/purchasing'
import PurchasingOptionsForm from './purchasing-options-form'
import Toggle from '@components/generic/toggle/toggle'
import fetch from '@lib/fetcher'
import hasPermission from '@lib/permissions/has-permission'
import { purchasingPermission } from '@lib/permissions'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

function ContentForm(props) {
  // Saving states
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const defaultShoppingOptions: PurchashingOptionsType = {
    multiple: false,
    sku: '',
    stock: 1,
    currency: '',
    price: 0.0,
    options: []
  }

  // used to store values
  const [state, setState] = useState({
    draft: false,
    purchasingOptions: defaultShoppingOptions
  })

  useEffect(() => {
    // Preload the form values
    if (props.type && props.content) {
      const filteredData = {}
      // We filter the data that comes from the API into the state, because we don't want to send to the PUT and POST request
      // additional information
      const allowedKeys = props.permittedFields
        .map((f) => f.name)
        .concat('draft')
        .concat('purchasingOptions')

      allowedKeys.map((k) => {
        filteredData[k] = props.content[k]
      })

      setState({
        ...state,
        ...filteredData,
        purchasingOptions: filteredData['purchasingOptions'] || defaultShoppingOptions
      })
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

  const onSubmit = () => {
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

  const { executeRecaptcha } = useGoogleReCaptcha()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = await executeRecaptcha('login_page')

    if (token) {
      onSubmit()
    }
  }

  // It needs the type definition
  if (!props.type) {
    return <p>Missing type definition</p>
  }

  return (
    <>
      <div className="contentForm">
        <form name="content-form" onSubmit={handleSubmit}>
          {props.type.publishing.draftMode && (
            <div className="draft input-group">
              <label>Draft</label>
              <Toggle
                value={state['draft']}
                onChange={handleFieldChange('draft')}
              />
            </div>
          )}

          {!!Object.keys(state).length &&
            props.permittedFields.map((field) => (
              <DynamicField
                key={field.name}
                field={field}
                value={state[field.name]}
                onChange={handleFieldChange(field.name)}
              />
            ))}

          {purchasingPermission(props.currentUser, 'sell', props.type.slug)  && <div className="purchasing-options-wrapper">
              <PurchasingOptionsForm value={state['purchasingOptions']} onChange={(val) => setState({
                ...state,
                purchasingOptions: val
              })} />
          </div>}

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
              content={{ ...state, author: props.content.author }}
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
            border-radius: 8px;
            box-shadow: var(--shadow-smallest);
            display: flex;
            justify-content: space-between;
            padding: var(--edge-gap);
            margin: 40px 0 24px;
          }

          .contentForm form {
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

export default memo(ContentForm)
