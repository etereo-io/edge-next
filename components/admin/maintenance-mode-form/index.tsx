import React, { useEffect, useState } from 'react'

import API from '@lib/api/api-endpoints'
import DynamicFieldEdit from '@components/generic/dynamic-field/dynamic-field-edit'
import { FIELDS } from '@lib/constants'
import LoadingSpinner from '@components/generic/loading/loading-spinner/loading-spinner'
import fetch from '@lib/fetcher'
import toast from '@lib/client/services/toast'
import useSWR from 'swr'

export default function MaintenanceModeForm() {
  const [enabled, setEnabled] = useState(false)

  const [saving, setSaving] = useState(false)

  const { data } = useSWR(
    API.maintenance,
    fetch
  )

  const changeMode = (value) => {
    setEnabled(value)
    setSaving(true)
    return fetch(API.maintenance, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        enabled: value
      }),
    })
      .then(() => {
        setSaving(false)
        toast.success('Maintenance mode updated')
      })
      .catch(() => {
        setSaving(false)
        setEnabled(!value)
        toast.error('Error updating maintenance mode')
      })

  }

  useEffect(() => {
    if (data) {
      setEnabled(data.enabled)
    }
  }, [data])

  return (
    <>
      <div className="maintenance-mode-form">
        <div className="field-row">
          <DynamicFieldEdit
            name="description"
            value={enabled}
            onChange={changeMode}
            field={{
              name: 'maintenance',
              type: FIELDS.BOOLEAN,
              description: `Enable to block access to all non-admin users`,
              label: 'Maintenance mode'
            }} />
        </div>
        {saving && <LoadingSpinner />}
      </div>
    </>
  )
}