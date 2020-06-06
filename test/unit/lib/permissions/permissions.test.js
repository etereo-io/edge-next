import { commentPermission, contentPermission, groupPermission, userPermission } from '../../../../lib/permissions'

import getPermissions from '../../../../lib/permissions/get-permissions'

jest.mock('../../../../lib/permissions/get-permissions')

describe('Entities permissions test', () => {
  afterEach(() => {
    getPermissions.mockReset()
  })

  describe('Content permissions', () => {
    test('Public user has no permissions', async () => {
      getPermissions.mockReturnValue({
        'content.project.read': ['USER']
      })
  
      expect(contentPermission(null, 'project', 'read')).toEqual(false)
    })

    test('Public user has permissions', async () => {
      getPermissions.mockReturnValue({
        'content.project.read': ['PUBLIC']
      })
  
      expect(contentPermission(null, 'project', 'read')).toEqual(true)
    })

    test('User can not edit another content from other user', async () => {
      getPermissions.mockReturnValue({
        'content.project.update': ['ADMIN']
      })

      const user = {
        roles: ['USER'],
        id: 'myid'
      }

      const content = {
        author: 'another'
      }
  
      expect(contentPermission(user, 'project', 'update', content)).toEqual(false)
    })

    test('User can edit own content', async () => {
      getPermissions.mockReturnValue({
        'content.project.update': ['ADMIN']
      })

      const user = {
        roles: ['USER'],
        id: 'myid'
      }

      const content = {
        author: 'myid'
      }
  
      expect(contentPermission(user, 'project', 'update', content)).toEqual(true)
    })

    test('Admin can edit any content', async () => {
      getPermissions.mockReturnValue({
        'content.project.update': ['ADMIN']
      })

      const user = {
        roles: ['ADMIN'],
        id: 'myid'
      }

      const content = {
        author: 'another'
      }
  
      expect(contentPermission(user, 'project', 'update', content)).toEqual(true)
    })
  })

  describe('Group permissions', () => {
    test('Public user has no permissions', async () => {
      getPermissions.mockReturnValue({
        'group.project.read': ['USER']
      })
  
      expect(groupPermission(null, 'project', 'read')).toEqual(false)
    })

    test('Public user has permissions', async () => {
      getPermissions.mockReturnValue({
        'group.project.read': ['PUBLIC']
      })
  
      expect(groupPermission(null, 'project', 'read')).toEqual(true)
    })

    test('User can not edit another group from other user', async () => {
      getPermissions.mockReturnValue({
        'group.project.update': ['ADMIN']
      })

      const user = {
        roles: ['USER'],
        id: 'myid'
      }

      const group = {
        author: 'another',
        members: []
      }
  
      expect(groupPermission(user, 'project', 'update', group)).toEqual(false)
    })

    test('User can edit own group', async () => {
      getPermissions.mockReturnValue({
        'group.project.update': ['ADMIN']
      })

      const user = {
        roles: ['USER'],
        id: 'myid'
      }

      const group = {
        author: 'myid',
        members: []
      }
  
      expect(groupPermission(user, 'project', 'update', group)).toEqual(true)
    })

    test('Group admin can edit group', async () => {
      getPermissions.mockReturnValue({
        'group.project.update': ['ADMIN', 'GROUP_ADMIN']
      })

      const user = {
        roles: ['USER'],
        id: 'myid'
      }

      const group = {
        author: 'another user',
        members: [{
          id: 'myid',
          roles: ['GROUP_ADMIN']
        }]
      }
  
      expect(groupPermission(user, 'project', 'update', group)).toEqual(true)
    })

    test('Admin can edit any group', async () => {
      getPermissions.mockReturnValue({
        'group.project.update': ['ADMIN']
      })

      const user = {
        roles: ['ADMIN'],
        id: 'myid'
      }

      const group = {
        author: 'another',
        members: []
      }
  
      expect(groupPermission(user, 'project', 'update', group)).toEqual(true)
    })
  })

 

})
