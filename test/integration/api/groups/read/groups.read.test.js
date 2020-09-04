import {
  findContent,
} from '../../../../../lib/api/entities/content'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import {
  getSession,
} from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/groups/[type]'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/content')

jest.mock('../../../../../edge.config', () => {

  const mockGroupType = {
    title: 'Project',

    slug: 'project',

    slugGeneration: ['title', 'createdAt'],

    publishing: {
      draftMode: true
    },

    permissions: {
      read: ['PUBLIC'],
      create: ['ADMIN', 'USER'],
      update: ['ADMIN'],
      delete: ['ADMIN'],
      admin: ['ADMIN'],
    },

    fields: [{
        name: 'title',
        type: 'text',
        label: 'Title',
        title: true,
        placeholder: 'Title',
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Description',
      },
      {
        name: 'image',
        type: 'img',
        label: 'Image',
        placeholder: 'Image',
      }
    ],

    user: {
      permissions: {
        admin: ['GROUP_ADMIN', 'ADMIN']
      }
    }
  }

  return {
    __esModule: true,
    getConfig: jest.fn().mockReturnValue({
      title: 'A test',
      description: 'A test',

      groups: {
        types: [mockGroupType]
      },

      user: {
        permissions: {

        },

        roles: [{
          label: 'user',
          value: 'USER'
        }],
        newUserRoles: ['USER'],
      },
    }),
  }
})

describe('Integrations tests for Groups endpoint', () => {


  beforeEach(() => {
    findContent.mockReturnValue(Promise.resolve({
      results: [],
      from: 0,
      limit: 0
    }))
  })

  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
    findContent.mockReset()
  })



  test('Should return 405 if required query string is missing', async () => {
    const res = await request(handler, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    expect(res.statusCode).toBe(405)
  })

  test('Should return 405 if group type is invalid', async () => {

    const params = {
      type: 'classroom'
    }

    const res = await request(handler, {
      method: 'GET',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    expect(res.statusCode).toBe(405)
  })

  test('Should return valid structure given a valid request', async () => {

    const params = {
      type: 'project'
    }



    getPermissions.mockReturnValue({
      'group.project.read': ['PUBLIC'],
      'group.project.admin': ['ADMIN'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({
      results: [],
      from: 0,
      limit: 0
    })
  })

  test('Should return 200 for a role that is not public', async () => {

    const params = {
      type: 'project'
    }

    getPermissions.mockReturnValue({
      'group.project.read': ['PUBLIC'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    expect(res.statusCode).toBe(200)
  })

  test('Should return 401 if it does not have permissions to access', async () => {

    const params = {
      type: 'project'
    }

    getPermissions.mockReturnValue({
      'group.project.read': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['PUBLIC'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    expect(res.statusCode).toBe(401)
  })

  test('Should return 200 if it does have permissions to access for USER', async () => {

    const params = {
      type: 'project'
    }

    getPermissions.mockReturnValue({
      'group.project.read': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    expect(res.statusCode).toBe(200)
  })

  test('Should return 200 for ADMIN', async () => {

    const params = {
      type: 'project'
    }

    getPermissions.mockReturnValue({
      'group.project.read': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    expect(res.statusCode).toBe(200)
  })

  describe('Filter by member', () => {
    test('Should filter grups that have this user as a member', async () => {

      const params = {
        type: 'project',
        from: 15,
        limit: 15,
        member: 'abc'
      }

      getPermissions.mockReturnValue({
        'group.project.read': ['PUBLIC'],
        'group.project.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const res = await request(handler, {
        method: 'GET',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        }
      })

      expect(res.statusCode).toBe(200)
      expect(findContent).toHaveBeenCalledWith(
        'project', {
          members: {
            $elemMatch: {
              id: 'abc'
            }
          }
        }, {
          from: 15,
          limit: 15,
          sortBy: undefined,
          sortOrder: undefined,
        }
      )
    })
  })


  describe('Pagination', () => {
    test('Should be called with the correct pagination', async () => {

      const params = {
        type: 'project',
        from: 15,
        limit: 15
      }

      getPermissions.mockReturnValue({
        'group.project.read': ['PUBLIC'],
        'group.project.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const res = await request(handler, {
        method: 'GET',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        }
      })
      expect(res.statusCode).toBe(200)

      expect(findContent).toHaveBeenCalledWith(
        'project', {}, {
          from: 15,
          limit: 15,
          sortBy: undefined,
          sortOrder: undefined,
        }
      )
    })


  })

  describe('Filter by author', () => {
    test('Should return only items for that author', async () => {

      const params = {
        type: 'project',
        from: 15,
        limit: 15,
        author: '2'
      }

      getPermissions.mockReturnValue({
        'group.project.read': ['PUBLIC'],
        'group.project.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const res = await request(handler, {
        method: 'GET',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        }
      })

      expect(res.statusCode).toBe(200)
      expect(findContent).toHaveBeenCalledWith(
        'project', {
          author: '2'
        }, {
          from: 15,
          limit: 15,
          sortBy: undefined,
          sortOrder: undefined,
        }
      )
    })
  })

  describe('Draft mode', () => {
    test('Should return only items that are not drafts', async () => {

      const params = {
        type: 'project',
        from: 15,
        limit: 15,
        author: '2'
      }


      getPermissions.mockReturnValue({
        'group.project.read': ['PUBLIC'],
        'group.project.admin': ['ADMIN'],
      })

      const res = await request(handler, {
        method: 'GET',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        }
      })

      expect(res.statusCode).toBe(200)
      expect(findContent).toHaveBeenCalledWith(
        'project', {
          author: '2',
          draft: false
        }, {
          from: 15,
          limit: 15,
          sortBy: undefined,
          sortOrder: undefined,
        }
      )
    })

    test('Should return all the items for admin', async () => {

      const params = {
        type: 'project',
        from: 0,
        limit: 50,
        author: '2'
      }


      getPermissions.mockReturnValue({
        'group.project.read': ['PUBLIC'],
        'group.project.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const res = await request(handler, {
        method: 'GET',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        }
      })

      expect(res.statusCode).toBe(200)
      expect(findContent).toHaveBeenCalledWith(
        'project', {
          author: '2'
        }, {
          from: 0,
          limit: 50,
          sortBy: undefined,
          sortOrder: undefined,
        }
      )


    })

    test('Should all the items for own user', async () => {

      const params = {
        type: 'project',
        from: 0,
        limit: 50,
        author: '2'
      }

      getPermissions.mockReturnValue({
        'group.project.read': ['PUBLIC'],
        'group.project.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: '2',
      })

      const res = await request(handler, {
        method: 'GET',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        }
      })
      expect(res.statusCode).toBe(200)
      expect(findContent).toHaveBeenCalledWith(
        'project', {
          author: '2'
        }, {
          from: 0,
          limit: 50,
          sortBy: undefined,
          sortOrder: undefined,
        }
      )
    })
  })
})