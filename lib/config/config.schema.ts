const { object, string, number, mixed, array, boolean } = require('yup')

import { DATABASES, FIELDS } from '@lib/constants'

import { UserSchema } from '@lib/api/entities/users/user.schema'

const InteractionSchema = object({
  type: string().required('Interaction type is required'),
  aggregation: string().nullable(),
  activeTitle: string().nullable(),
  inactiveTitle: string().nullable(),
  permissions: object({
    read: array(string()),
    create: array(string()),
    delete: array(string()),
    admin: array(string()),
  }),
})

const FieldSchema = object({
  name: string().required('Required field name'),
  label: string().required('Missing field label'),
  type: string()
    .required('Missing field type')
    .matches(
      `(${FIELDS.TAGS}|${FIELDS.TEXT}|${FIELDS.TEXTAREA}|${FIELDS.IMAGE}|${FIELDS.FILE}|${FIELDS.SELECT}|${FIELDS.NUMBER}|${FIELDS.JSON}|${FIELDS.BOOLEAN}|${FIELDS.RADIO}|${FIELDS.VIDEO_URL}|${FIELDS.MARKDOWN}|${FIELDS.DATE}|${FIELDS.URL}|${FIELDS.TEL}|${FIELDS.ENTITY_SEARCH}|${FIELDS.EMAILS}|${FIELDS.TIME}|${FIELDS.DATETIME}|${FIELDS.CITY})`,
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
  placeholder: string(),
  description: string(),
  hidden: boolean().default(false),
  entity: string(),
  entityType: string(),
  cypher: object({
    enabled: boolean().default(false),
    read: array(string()).default([]),
  }).nullable(),
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
  monetization: object({
    web: boolean().default(false),
  }),
  permissions: object({
    read: array(string()),
    create: array(string()),
    update: array(string()),
    delete: array(string()),
    admin: array(string()),
  }),
  comments: object({
    enabled: boolean().required('Missing content type comments enabled flag'),
    permissions: object({
      read: array(string()),
      create: array(string()),
      update: array(string()),
      delete: array(string()),
      admin: array(string()),
    })
      .required('Missing comment permissions')
      .default({
        read: [],
        create: [],
        update: [],
        delete: [],
        admin: [],
      }),
  }),
  purchasing: object({
    enabled: boolean().default(false),
    permissions: object({
      buy: array(string()),
      sell: array(string()),
      ship: array(string()),
      admin: array(string()),
    })
      .default({
        buy: [],
        sell: [],
        ship: [],
        admin: [],
      }),
  }),
  entityInteractions: array(InteractionSchema).nullable(),
})

const GroupTypeSchema = object({
  title: string().required('Missing group type title'),
  slug: string().required('Required group type slug'),
  slugGeneration: array(string()).default(['id', 'createdAt']),
  fields: array(FieldSchema),
  publishing: object({
    draftMode: boolean().default(false),
    title: string().default(''),
  }).required('Please fill in the publishing settings'),
  permissions: object({
    read: array(string()),
    create: array(string()),
    update: array(string()),
    delete: array(string()),
    admin: array(string()),
  }),
  user: object({
    permissions: object({
      read: array(string()),
      create: array(string()),
      update: array(string()),
      admin: array(string()),
    }),
  }),
  contentTypes: array(
    object({
      slug: string(),
      permissions: object({
        read: array(string()),
        create: array(string()),
        update: array(string()),
        admin: array(string()),
      }),
    })
  ),
  entityInteractions: array(InteractionSchema).nullable(),
})

export default object({
  title: string().required('Required site title'),
  description: string().required('Required site description'),
  slogan: string().default(''),
  api: object({
    bodyParser: object({
      sizeLimit: string().default('1mb'),
    }),
  }),
  logger: object().default({
    level: 'ERROR',
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
    contact: string(),
  }),
  theme: object({
    default: string()
      .default('light-theme')
      .required('Missing default theme'),
    themes: array(
      object({
        label: string().required('Missing theme label'),
        value: string().required('Missing theme value'),
        mainColor: string().required('Missing theme color'),
        borderColor: string().required('Missing theme borderColor'),
      })
    ),
  }),
  activity: object({
    enabled: boolean().required('Missing activity enabled status'),
    permissions: object(),
  }),
  user: object({
    roles: array(
      object({
        label: string(),
        value: string(),
      })
    ).required('Missing roles list'),
    newUserRoles: array(string()).required('Missing new user roles list'),

    emailVerification: boolean(),
    providers: object(),
    profile: object({
      fields: array(FieldSchema),
    }),
    permissions: object({
      read: array(string()),
      create: array(string()),
      update: array(string()),
      delete: array(string()),
      admin: array(string()),
    }).required('Missing user permissions'),
    initialUsers: array(UserSchema),
    entityInteractions: array(InteractionSchema).nullable(),
  }).required('Missing user configuration'),
  content: object({
    types: array(ContentTypeSchema),
    initialContent: array(),
  }),
  groups: object({
    types: array(GroupTypeSchema),
    initialGroups: array(),
  }),
  superSearch: object({
    enabled: boolean(),
    permissions: object(),
    entities: array(
      object({
        name: string(),
        fields: array(string()),
        permissions: array(string()),
        type: string(),
        fieldsForShow: array(string()),
      })
    ),
  }),
  statistic: object({
    users: object({
      enabled: boolean(),
    }),
    content: array(
      object({
        name: string(),
        title: string(),
      })
    ),
  }),
})
