import DynamicFieldEdit from '@components/generic/dynamic-field/dynamic-field-edit'
import { FIELDS } from '@lib/constants'
import React from 'react'
import { SEOPropertiesType } from '@lib/types/seo'

type PropTypes = {
  value: SEOPropertiesType,
  onChange: (val: SEOPropertiesType) => void
}

export default function SEOForm({
  value,
  onChange
}: PropTypes) {
  return (
    <>
      <div className="seo-form">
        <h4>Search Engine Preview</h4>
        <div className="field-row">
          <DynamicFieldEdit
            name="slug"
            value={value.slug}
            onChange={(val) => onChange({
              ...value,
              slug: val
            })}
            field={{
              name: 'slug',
              type: FIELDS.TEXT,
              placeholder: 'Slug',
              description: `${value.slug.length} of 255 characters`,
              label: 'Slug',
              minLength: 0,
              maxLength: 255
            }} />
        </div>
        <div className="field-row">
          <DynamicFieldEdit
            name="title"
            value={value.title}
            onChange={(val) => onChange({
              ...value,
              title: val
            })}
            field={{
              name: 'title',
              type: FIELDS.TEXT,
              placeholder: 'Search engine title',
              description: `${value.title.length} of 70 characters`,
              label: 'Title',
              minLength: 0,
              maxLength: 70
            }} />
        </div>
        <div className="field-row">
          <DynamicFieldEdit
            name="description"
            value={value.description}
            onChange={(val) => onChange({
              ...value,
              description: val
            })}
            field={{
              name: 'description',
              type: FIELDS.TEXTAREA,
              placeholder: 'Search engine description',
              description: `${value.description.length} of 255 characters`,
              label: 'description',
              minLength: 0,
              maxLength: 255
            }} />
        </div>
      </div>
      <style jsx>{
        `
        
        `
      }</style>
    </>
  )
}