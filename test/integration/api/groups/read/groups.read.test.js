import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import { findContent } from '../../../../../lib/api/entities/content/content'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/groups/[type]'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/content/content')

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

    fields: [
      {
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
  }

  return {
    __esModule: true,
    getConfig: jest.fn().mockReturnValue({
      title: 'A test',
      description: 'A test',
  
      groups: {
        types: [mockGroupType]
      }
    }),
  }
})

describe('Integrations tests for Groups endpoint', () => {
  let server
  let url

  beforeEach(() => {
    findContent.mockReturnValue(Promise.resolve({
      results: [],
      from: 0,
      limit: 0
    }))
  })

  afterEach(() => {
    getPermissions.mockClear()
    getSession.mockClear()
    findContent.mockClear()
  })

  beforeAll(async (done) => {
    server = http.createServer((req, res) =>
      apiResolver(req, res, undefined, handler)
    )
    url = await listen(server)

    done()
  })

  afterAll((done) => {
    server.close(done)
  })

  test('Should return 405 if required query string is missing', async () => {
    const response = await fetch(url)
    expect(response.status).toBe(405)
  })

  test('Should return 405 if group type is invalid', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'classroom' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )
    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(405)
  })

  test('Should return valid structure given a valid request', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'project' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getPermissions.mockReturnValueOnce({
      'group.project.read': ['PUBLIC'],
      'group.project.admin': ['ADMIN'],
    })

    const response = await fetch(urlToBeUsed.href)
    const jsonResult = await response.json()

    expect(response.status).toBe(200)
    expect(jsonResult).toMatchObject({
      results: [],
      from: 0,
      limit: 0
    })
  })

  test('Should return 200 for a role that is not public', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'project' }

    getPermissions.mockReturnValueOnce({
      'group.project.read': ['PUBLIC'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
    })

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(200)
  })

  test('Should return 401 if it does not have permissions to access', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'project' }

    getPermissions.mockReturnValueOnce({
      'group.project.read': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['PUBLIC'],
    })

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(401)
  })

  test('Should return 200 if it does have permissions to access for USER', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'project' }

    getPermissions.mockReturnValueOnce({
      'group.project.read': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
    })

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(200)
  })

  test('Should return 200 for ADMIN', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'project' }

    getPermissions.mockReturnValueOnce({
      'group.project.read': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
    })

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(200)
  })

  describe('Filter by member', () => {
    test('Should filter grups that have this user as a member', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'project', from: 15, limit: 15, member: 'abc' }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'group.project.read': ['PUBLIC'],
        'group.project.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const response = await fetch(urlToBeUsed.href)
     
      expect(response.status).toBe(200)
      expect(findContent).toHaveBeenCalledWith(
        'project',
        { members: { $elemMatch : { id : 'abc' }}},
        {
          from: '15',
          limit: '15',
          sortBy: undefined,
          sortOrder: undefined,
        }
      )
    })
  })


  describe('Pagination', () => {
    test('Should be called with the correct pagination', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'project', from: 15, limit: 15 }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'group.project.read': ['PUBLIC'],
        'group.project.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const response = await fetch(urlToBeUsed.href)

      expect(response.status).toBe(200)
   
      expect(findContent).toHaveBeenCalledWith(
        'project',{},
        {
          from: '15',
          limit: '15',
          sortBy: undefined,
          sortOrder: undefined,
        }
      )
    })

    
  })

  describe('Filter by author', () => {
    test('Should return only items for that author', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'project', from: 15, limit: 15, author: 2 }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'group.project.read': ['PUBLIC'],
        'group.project.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const response = await fetch(urlToBeUsed.href)
     

      expect(response.status).toBe(200)
      expect(findContent).toHaveBeenCalledWith(
        'project',{ author: '2'},
        {
          from: '15',
          limit: '15',
          sortBy: undefined,
          sortOrder: undefined,
        }
      )
    })
  })

  describe('Draft mode', () => {
    test('Should return only items that are not drafts', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'project', from: 15, limit: 15, author: 2 }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'group.project.read': ['PUBLIC'],
        'group.project.admin': ['ADMIN'],
      })

      const response = await fetch(urlToBeUsed.href)


      expect(response.status).toBe(200)
      expect(findContent).toHaveBeenCalledWith(
        'project',
        { author: '2', 
        draft: false},
        {
          from: '15',
          limit: '15',
          sortBy: undefined,
          sortOrder: undefined,
        }
      )
    })

    test('Should return all the items for admin', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'project', from: 0, limit: 50, author: 2 }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'group.project.read': ['PUBLIC'],
        'group.project.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const response = await fetch(urlToBeUsed.href)


      expect(response.status).toBe(200)
      expect(findContent).toHaveBeenCalledWith(
        'project',
        { author: '2'},
        {
          from: '0',
          limit: '50',
          sortBy: undefined,
          sortOrder: undefined,
        }
      )


    })

    test('Should all the items for own user', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'project', from: 0, limit: 50, author: '2' }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'group.project.read': ['PUBLIC'],
        'group.project.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: '2',
      })

      const response = await fetch(urlToBeUsed.href)

      expect(response.status).toBe(200)
      expect(findContent).toHaveBeenCalledWith(
        'project',
        { author: '2'},
        {
          from: '0',
          limit: '50',
          sortBy: undefined,
          sortOrder: undefined,
        }
      )
    })
  })
})
