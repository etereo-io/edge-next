const { object, string, number, array, bool } = require('yup')

import { DATABASES, FIELDS } from './config-constants'

import { boolean } from 'yup'

const FieldSchema = object({
  name: string().required('Required field name'),
  label: string().required('Missing field label'),
  type: string()
    .required('Missing field type')
    .matches(
      `(${FIELDS.TAGS}|${FIELDS.TEXT}|${FIELDS.TEXTAREA}|${FIELDS.IMAGE}|${FIELDS.FILE}|${FIELDS.SELECT}|${FIELDS.NUMBER}|${FIELDS.JSON}|${FIELDS.BOOLEAN}|${FIELDS.RADIO})`,
      'Invalid field type'
    ),
})

const ContentTypeSchema = object({
  title: object().required('Missing content type title'),
  slug: string().required('Required content type slug'),
  slugGeneration: array(string()).default(['id', 'createdAt']),
  fields: array(FieldSchema),
  publishing: object({
    draftMode: boolean()
  }).required('Please fill in the publishing settings'),
  comments: object({
    enabled: bool().required('Missing content type comments enabled flag'),
    permisions: object({
      read: array(string()),
      create: array(string()),
      update: array(string()),
      delete: array(string()),
      admin: array(string()),
    }),
  }),
})

export default object({
  title: string().required('Required site title'),
  description: string().required('Required site description'),
  storage: object().required('Missing storage configuration'),
  database: object({
    type: string().matches(
      `(${DATABASES.FIREBASE}|${DATABASES.IN_MEMORY}|${DATABASES.MONGO})`,
      'Invalid database type'
    ),
  }),
  activity: object({
    enabled: bool().required('Missing activity enabled status'),
    permissions: object(),
  }),
  user: object({
    roles: array(string()).required('Missing roles list'),
    permissions: object({
      read: array(string()),
      create: array(string()),
      update: array(string()),
      delete: array(string()),
      admin: array(string()),
    }).required('Missing user permissions'),
  }).required('Missing user configuration'),
  tags: object({
    initialTags: array(object()), // TODO: complete schema
    permissions: object({
      read: array(string()),
      create: array(string()),
      update: array(string()),
      delete: array(string()),
      admin: array(string()),
    }).required('Missing tags permissions'),
  }).required('Missing tags configuration'),
  content: object({
    types: array(ContentTypeSchema),
    initialContent: array(),
  }),
})
