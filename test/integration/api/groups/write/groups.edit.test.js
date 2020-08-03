import * as handler from '../../../../../pages/api/groups/[type]/[slug]'

import { deleteFile, uploadFile } from '../../../../../lib/api/storage'
import {
  findOneContent,
  updateOneContent,
} from '../../../../../lib/api/entities/content/content'

import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/content/content')
jest.mock('../../../../../lib/api/storage')

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
        name: 'images',
        multiple: true,
        type: 'img',
        label: 'Image',
        placeholder: 'Image',
      }
    ],

    user : {
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
      }
    }),
  }
})  

describe('Integrations tests for group edition', () => {
  let server
  let url

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

  beforeEach(() => {
    updateOneContent.mockReturnValue(Promise.resolve({ something: 'something '}))
  })

  afterEach(() => {
    updateOneContent.mockReset()
    findOneContent.mockReset()
    getPermissions.mockReset()
    getSession.mockReset()
  })


  test('a PUBLIC user should not be able to edit a group if its not allowed', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'project', slug: '1' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    findOneContent.mockReturnValueOnce(Promise.resolve({
      author: 'abc',
      members: []
    }))

    // Mock permissions
    getPermissions.mockReturnValue({
      'group.project.update': ['ADMIN'],
      'group.project.admin': ['ADMIN'],
    })

    // Current user is PUBLIC
    getSession.mockReturnValueOnce()

    const newData = {
      title: 'test'
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    })

    const jsonResult = await response.json()

    expect(response.status).toBe(401)
    expect(jsonResult).toMatchObject({
      error: 'User not authorized to perform operation on group project',
    })
  })

  test('a USER user should  be able to edit a group if its the author', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'project', slug: '1' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    findOneContent.mockReturnValueOnce(Promise.resolve({
      author: 'abc',
      id: 'something',
      members: []
    }))

    // Mock permissions
    getPermissions.mockReturnValue({
      'group.project.update': ['ADMIN'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      id: 'abc',
      roles: ['USER']
    })

    const newData = {
      title: 'test'
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    })
   
    expect(response.status).toBe(200)

    expect(updateOneContent).toHaveBeenCalledWith('project', 'something', {
      title: 'test'
    })
  })

  test('a USER user should  be able to edit a group if its listed in the members group with a privileged role', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'project', slug: '1' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    findOneContent.mockReturnValueOnce(Promise.resolve({
      author: 'a person',
      id: 'something',
      members: [{
        id: 'abc',
        roles: ['GROUP_ADMIN']
      }]
    }))

    // Mock permissions
    getPermissions.mockReturnValue({
      'group.project.update': ['ADMIN','GROUP_ADMIN'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      id: 'abc',
      roles: ['USER']
    })

    const newData = {
      title: 'test'
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    })
   
    expect(response.status).toBe(200)

    expect(updateOneContent).toHaveBeenCalledWith('project', 'something', {
      title: 'test'
    })
  })
 

  describe('Files', () => {
    it('should call the delete file for an update removing a file', async () => {
      const urlToBeUsed = new URL(url)

      urlToBeUsed.searchParams.append('type', 'project')
      urlToBeUsed.searchParams.append('slug', 'profile')

      // Mock permissions
      getPermissions.mockReturnValue({
        'group.project.update': ['ADMIN'],
        'group.project.admin': ['ADMIN'],
      })

      // Current user is logged
      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: '1',
      })

      // Find one user returns the data
      findOneContent.mockReturnValueOnce(
        Promise.resolve({
          author: '1',
          images: [
            {
              path: 'abc.test',
            },
          ],
          members: []
        })
      )

      const newData = {
        images: [],
      }

      const response = await fetch(urlToBeUsed.href, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })

      expect(response.status).toBe(200)

      expect(deleteFile).toHaveBeenCalledWith('abc.test')
    })
  })
})
