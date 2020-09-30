import { getConfig } from '../../../../edge.config'
import loadConfig from '@lib/config/load-config'

jest.mock('../../../../edge.config')

describe('Load configuration file', () => {
  afterEach(() => {
    getConfig.mockReset()
  })

  test('Should complain about missing required fields', async () => {
    getConfig.mockReturnValueOnce({
      title: '',
      description: '',
    })

    expect(() => {
      const conf = loadConfig()
    }).toThrowError(/Invalid configuration file: Required site title/)
  })

  test('Should not throw when the config file is valid', async () => {
    getConfig.mockReturnValueOnce({
      title: 'A valid config',
      description: 'This is the description',
      user: {
        roles: [{ label : 'user', value: 'USER'}],
        newUserRoles: ['USER'],
      }
    })

    expect(() => {
      const conf = loadConfig()
    }).not.toThrow()
  })

  test('Should load correct group comments permissions', async () => {
   

    const publicRole = 'PUBLIC'
    const adminRole = 'ADMIN'
    const userRole = 'USER'
    
    const postContentType = {
      title: 'Posts',
  
      slug: 'post',
  
      slugGeneration: ['title', 'createdAt'],
  
      permissions: {
        read: [publicRole],
        create: [adminRole, userRole],
        update: [adminRole],
        delete: [adminRole],
        admin: [adminRole],
      },
  
      publishing: {
        draftMode: true,
        title: 'title',
      },
  
      comments: {
        enabled: true,
        permissions: {
          read: [publicRole],
          create: [userRole, adminRole],
          update: [adminRole],
          delete: [adminRole],
          admin: [adminRole],
        },
      },
  
      entityInteractions: [
        {
          type: 'like',
          aggregation: 'sum',
          activeTitle: 'Unlike',
          inactiveTitle: 'Like',
          permissions: {
            read: ['PUBLIC', 'USER'],
            create: ['USER'],
            delete: ['USER'],
          },
        },
      ],
  
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          placeholder: 'Title',
          minlength: 8,
          maxlength: 150,
          required: true,
          errorMessage: 'Title must be between 8 and 150 characters',
        }
      ],
    }

    const publishingGroupType = {
      title: 'Groups',
  
      slug: 'publishing-group',
  
      slugGeneration: ['title', 'createdAt'],
  
      permissions: {
        read: [publicRole],
        create: [adminRole, userRole],
        update: [adminRole],
        delete: [adminRole],
        admin: [adminRole],
      },
  
      roles: [
        {
          label: 'Group Member',
          value: 'GROUP_MEMBER',
        },
        {
          label: 'Group admin',
          value: 'GROUP_ADMIN',
        },
      ],
  
      publishing: {
        draftMode: true,
        title: 'title',
      },
  
      user: {
        requireApproval: true, // Default require approval or not
        permissions: {
          read: ['GROUP_MEMBER'],
          join: [userRole],
          create: ['GROUP_ADMIN', adminRole],
          update: ['GROUP_ADMIN', adminRole],
          delete: ['GROUP_ADMIN', adminRole],
          admin: ['GROUP_ADMIN', adminRole],
        },
      },
  
      contentTypes: [
        {
          slug: 'post',
          permissions: {
            read: ['GROUP_MEMBER'],
            create: ['GROUP_MEMBER'],
            update: ['GROUP_ADMIN'],
            delete: ['GROUP_ADMIN'],
            admin: ['GROUP_ADMIN'],
          },
          comments: {
            enabled: true,
            permissions: {
              read: ['GROUP_MEMBER'],
              create: ['GROUP_MEMBER'],
              update: ['GROUP_ADMIN'],
              delete: ['GROUP_ADMIN'],
              admin: ['GROUP_ADMIN'],
            },
          }
        },
        
      ],
  
      entityInteractions: [
        {
          type: 'like',
          aggregation: 'sum',
          activeTitle: 'Unlike',
          inactiveTitle: 'Like',
          permissions: {
            read: ['USER'],
            create: ['ADMIN'],
            delete: ['USER'],
          },
        },
      ],
  
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          placeholder: 'Title',
          minlength: 8,
          maxlength: 150,
          required: true,
          errorMessage: 'Title must be between 8 and 150 characters',
        }
      ],
    }

    getConfig.mockReturnValueOnce({
      title: 'A valid config',
      description: 'This is the description',
      user: {
        roles: [{ label : 'user', value: 'USER'}],
        newUserRoles: ['USER'],
      },
      content: {
        // Different content types defined
        types: [postContentType],
        initialContent: [],
      },
  
      // Groups definitions
      groups: {
        types: [publishingGroupType],
      },
    })
    const conf = loadConfig()

    expect(conf.permissions['group.publishing-group.content.post.comments.read']).toEqual(['GROUP_MEMBER'])
    expect(conf.permissions['group.publishing-group.content.post.comments.admin']).toEqual(['GROUP_ADMIN'])

  })
})
