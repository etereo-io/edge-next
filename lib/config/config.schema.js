const { object, string, number, mixed, array, boolean } = require('yup')

import { DATABASES, FIELDS } from './config-constants'

import { UserSchema } from '../api/users/user.schema'

const FieldSchema = object({
  name: string().required('Required field name'),
  label: string().required('Missing field label'),
  type: string()
    .required('Missing field type')
    .matches(
      `(${FIELDS.TAGS}|${FIELDS.TEXT}|${FIELDS.TEXTAREA}|${FIELDS.IMAGE}|${FIELDS.FILE}|${FIELDS.SELECT}|${FIELDS.NUMBER}|${FIELDS.JSON}|${FIELDS.BOOLEAN}|${FIELDS.RADIO}|${FIELDS.VIDEO_URL}|${FIELDS.MARKDOWN})`,
      'Invalid field type'
    ),
  required: boolean().default(false),
  roles: array().default([]),
  pattern: mixed(),
  defaultValue: mixed(),
  minlength: number(),
  maxlength: number(),
  min: number(),
  max: number(),
  options: array(
    object({
      label: string().required(),
      value: mixed().required(),
    })
  ),
  accept: string(),
  capture: string(),
  multiple: boolean().default(false),
  errorMessage: string(),
  placeholder: string()
})

const ContentTypeSchema = object({
  title: string().required('Missing content type title'),
  slug: string().required('Required content type slug'),
  slugGeneration: array(string()).default(['id', 'createdAt']),
  fields: array(FieldSchema),
  publishing: object({
    draftMode: boolean().default(false),
    title: string().default(''),
  }).required('Please fill in the publishing settings'),
  display: string().default('list'),
  monetization: object({
    web: boolean().default(false)
  }),
  comments: object({
    enabled: boolean().required('Missing content type comments enabled flag'),
    permisions: object({
      read: array(string()),
      create: array(string()),
      update: array(string()),
      delete: array(string()),
      admin: array(string()),
    }).required('Missing comment permissions').default({
      read: [],
      create: [],
      update: [],
      delete: [],
      admin: []
    }),
  }),
})

export default object({
  title: string().required('Required site title'),
  description: string().required('Required site description'),
  slogan: string().default(''),
  api: object({
    bodyParser: object({
      sizeLimit: string().default('1mb')
    })
  }),
  storage: object().required('Missing storage configuration'),
  database: object({
    type: string().matches(
      `(${DATABASES.FIREBASE}|${DATABASES.IN_MEMORY}|${DATABASES.MONGO})`,
      'Invalid database type'
    ),
  }),
  url: string(),
  emails: object({
    from: string(),
    contact: string()
  }),
 theme: object({
    default: string().default('light-theme').required('Missing default theme'),
    themes: array(object({
      label: string().required('Missing theme label'),
      value: string().required('Missing theme value'),
      mainColor: string().required('Missing theme color'),
      borderColor: string().required('Missing theme borderColor')
    }))
  }),
  activity: object({
    enabled: boolean().required('Missing activity enabled status'),
    permissions: object(),
  }),
  user: object({
    roles: array(string()).required('Missing roles list'),
    emailVerification: boolean(),
    providers: object(),
    profile: object({
      fields: array(FieldSchema)
    }),
    permissions: object({
      read: array(string()),
      create: array(string()),
      update: array(string()),
      delete: array(string()),
      admin: array(string()),
    }).required('Missing user permissions'),
    initialUsers: array(UserSchema)
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
