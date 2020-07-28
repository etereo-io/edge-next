import { addContent } from '../../../../../lib/api/entities/content/content'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
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

    roles: [{
      label: 'Group member',
      value: 'GROUP_MEMBER',
    }, {
      label: 'Group admin',
      value: 'GROUP_ADMIN',
    }],

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
        minlength: 2,
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

    user : {
      permissions: {
        
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
      }
    }),
  }
})

describe('Integrations tests for Groups creation endpoint', () => {
  let server
  let url

  beforeEach(() => {
    addContent.mockReturnValue(Promise.resolve({ id: 'abc' }))
  })

  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
    addContent.mockReset()
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

    getPermissions.mockReturnValue({
      'group.project.create': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id-initial-user',
    })

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGroup),
    })

    expect(response.status).toEqual(405)
  })

  test('Should return 405 if group type is invalid', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'classroom' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getPermissions.mockReturnValue({
      'group.project.create': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-another-id',
    })

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGroup),
    })

    expect(response.status).toBe(405)
  })

  test('Should return 400 if group validation fails', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'project' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getPermissions.mockReturnValue({
      'group.project.create': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-some-id',
    })

    const newGroup = {
      title: 's',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGroup),
    })

    const jsonResult = await response.json()

    expect(response.status).toBe(400)
    expect(jsonResult).toMatchObject({
      error: 'Invalid data: title length is less than 2',
    })
  })

  test('Should return 200 for a role that is allowed', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'project' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getPermissions.mockReturnValue({
      'group.project.create': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'allowed-user',
    })

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGroup),
    })

    expect(response.status).toBe(200)
  })

  
  test('Should return 401 if it does not have permissions to create group', async () => {
    getPermissions.mockReturnValue({
      'group.project.create': ['ANOTHER_ROLE', 'OTHER_STUFF'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['SAN BENITOP'],
      id: 'test-id',
    })

    const urlToBeUsed = new URL(url)
    const params = { type: 'project' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGroup),
    })

    expect(response.status).toBe(401)
  })


  test('Should return 200 for admin when creating group', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'project' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getPermissions.mockReturnValue({
      'group.project.create': ['ADMIN'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
      id: 'test-id',
    })

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGroup),
    })

    expect(response.status).toBe(200)
  })



  test('Should return 401 if the member role is invalid', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'project' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getPermissions.mockReturnValue({
      'group.project.create': ['ADMIN'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
      id: 'test-id',
    })

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
      members: [{
        role: 'GROUP_OTHER_STUFF',
        id: 'abc'
      }]
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGroup),
    })

    expect(response.status).toBe(400)
  })

  test('Should return 200 if the member role is valid', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'project' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getPermissions.mockReturnValue({
      'group.project.create': ['ADMIN'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
      id: 'test-id',
    })

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
      members: [{
        role: 'GROUP_MEMBER',
        id: 'abc'
      }]
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGroup),
    })

    expect(response.status).toBe(200)
  })

 
})
