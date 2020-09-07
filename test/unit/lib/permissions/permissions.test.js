import { commentPermission, contentPermission, groupCommentPermission, groupContentPermission, groupPermission, interactionPermission, userPermission } from '../../../../lib/permissions'

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


  describe('Group content permissions', () => {
    

    test('Public user has no permissions', async () => {
      const group = {
        members: [],
      }

      getPermissions.mockReturnValue({
        'group.project.content.task.read': ['GROUP_MEMBER']
      })

  
      expect(groupContentPermission(null, 'project', 'task', 'read', group)).toEqual(false)
    })

    test('Public user has permissions', async () => {
      const group = {
        members: [],
      }

      getPermissions.mockReturnValue({
        'group.project.content.task.read': ['PUBLIC']
      })

  
      expect(groupContentPermission(null, 'project', 'task', 'read', group)).toEqual(true)
    })

    test('Member user has permissions', async () => {
      const group = {
        members: [{
          id: 'abc',
          roles: ['GROUP_MEMBER']
        }],
      }

      getPermissions.mockReturnValue({
        'group.project.content.task.read': ['GROUP_MEMBER']
      })

  
      expect(groupContentPermission({
        id: 'abc'
      }, 'project', 'task', 'read', group)).toEqual(true)
    })

    test('Non Member user has no permissions', async () => {
      const group = {
        members: [{
          id: 'abc',
          roles: ['GROUP_MEMBER']
        }],
      }

      getPermissions.mockReturnValue({
        'group.project.content.task.read': ['GROUP_MEMBER']
      })

  
      expect(groupContentPermission({
        id: 'xxxx'
      }, 'project', 'task', 'read', group)).toEqual(false)
    })


    test('User can not edit another content from other user inside a group', async () => {
      const group = {
        members: []
      }

      getPermissions.mockReturnValue({
        'group.project.content.task.update': ['ADMIN']
      })

      const user = {
        roles: ['USER'],
        id: 'myid'
      }

      const content = {
        author: 'another'
      }
  
      expect(groupContentPermission(user, 'project', 'task', 'update', group, content)).toEqual(false)
    })

    test('User can edit own content inside a group', async () => {
      const group = {
        members: [],
      }

      getPermissions.mockReturnValue({
        'group.project.content.task.update': ['ADMIN']
      })

      const user = {
        roles: ['USER'],
        id: 'myid'
      }

      const content = {
        author: 'myid'
      }
  
      expect(groupContentPermission(user, 'project', 'task', 'update', group, content)).toEqual(true)
    })

    test('User with edit permissions can edit other content inside a group', async () => {
      const group = {
        members: [ {
          id: '111',
          roles: ['SECRET_ROLE']
        }],
        permissions: {
          'group.project.content.task.read': ['SECRET_ROLE'],
          'group.project.content.task.update': ['SECRET_ROLE']
        }
      }

      getPermissions.mockReturnValue({
        'group.project.content.task.update': ['ADMIN']
      })

      const user = {
        roles: ['USER'],
        id: '111' // SECRET_ROLE
      }

      const content = {
        author: 'myid'
      }
  
      expect(groupContentPermission(user, 'project', 'task', 'update', group, content)).toEqual(true)
    })

    test('Content admin can edit any content, indenpendent of a group', async () => {
      const group = {
        members: [{
          id: 'abc',
          roles: ['GROUP_MEMBER']
        }, {
          id: 'xxx',
          roles: ['GROUP_ADMIN']
        }],
        permissions: {
          'group.project.content.task.read': ['GROUP_MEMBER', 'GROUP_ADMIN'],
          'group.project.content.task.update': ['GROUP_ADMIN']
        }
      }
      getPermissions.mockReturnValue({
        'content.project.admin': ['ADMIN']
      })

      const user = {
        roles: ['ADMIN'],
        id: 'abc'
      }

      const content = {
        author: 'another'
      }
  
      expect(groupContentPermission(user, 'project', 'task', 'update', group, content)).toEqual(true)
    })
  })

  test('Normal member can not edit other content', async () => {
    const group = {
      members: [{
        id: 'abc',
        roles: ['GROUP_MEMBER']
      }, {
        id: 'xxx',
        roles: ['GROUP_ADMIN']
      }],
      permissions: {
        'group.project.content.task.read': ['GROUP_MEMBER', 'GROUP_ADMIN'],
        'group.project.content.task.update': ['GROUP_ADMIN']
      }
    }
    getPermissions.mockReturnValue({
      'content.project.admin': ['ADMIN']
    })

    const user = {
      roles: ['USER'],
      id: 'abc'
    }

    const content = {
      author: 'another'
    }

    expect(groupContentPermission(user, 'project', 'task', 'update', group, content)).toEqual(false)
  })

  describe('Comments permission', () => {
    test('Public user can list comments ', () => {
      getPermissions.mockReturnValue({
        'content.test.comments.read': ['PUBLIC']
      })

      expect(commentPermission(null, 'test', 'read')).toEqual(true)
  
    })

    test('Public user can not list comments ', () => {
      getPermissions.mockReturnValue({
        'content.test.comments.read': ['USER']
      })

      expect(commentPermission(null, 'test', 'read')).toEqual(false)
  
    })

    test('Admin can list comments ', () => {
      getPermissions.mockReturnValue({
        'content.test.comments.admin': ['ADMIN']
      })

      expect(commentPermission({
        roles: ['ADMIN']
      }, 'test', 'read')).toEqual(true)
  
    })

    test('Owner can edit own comment ', () => {
      getPermissions.mockReturnValue({
        'content.test.comments.update': ['ADMIN']
      })

      expect(commentPermission({
        id: 'abc',
        roles: ['USER']
      }, 'test', 'update', { author: 'abc'})).toEqual(true)
  
    })

    test('User can not edit other comment ', () => {
      getPermissions.mockReturnValue({
        'content.test.comments.update': ['ADMIN']
      })

      expect(commentPermission({
        id: 'abc',
        roles: ['USER']
      }, 'test', 'update', { author: 'xxxx'})).toEqual(false)
  
    })
  })


  describe('User permission', () => {
    test('Public user can list user ', () => {
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC']
      })

      expect(userPermission(null, 'read')).toEqual(true)
    })

    test('Public user can list a user ', () => {
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC']
      })

      expect(userPermission(null, 'read', '@userid')).toEqual(true)
    })

    test('Public user can not list user ', () => {
      getPermissions.mockReturnValue({
        'user.read': ['USER']
      })

      expect(userPermission(null, 'read')).toEqual(false)
    })

    test('User can see own profile ', () => {
      getPermissions.mockReturnValue({
        'user.read': ['RESTRICTED_ROLE']
      })

      expect(userPermission({
        id: 'abc',
        roles: ['USER']
      }, 'read', 'abc')).toEqual(true)
    })

    test('User can see me profile ', () => {
      getPermissions.mockReturnValue({
        'user.read': ['RESTRICTED_ROLE']
      })

      expect(userPermission({
        id: 'abc',
        roles: ['USER']
      }, 'read', 'me')).toEqual(true)
    })

    test('User can not see other profile ', () => {
      getPermissions.mockReturnValue({
        'user.read': ['RESTRICTED_ROLE']
      })

      expect(userPermission({
        id: 'abc',
        roles: ['USER']
      }, 'read', '@jimmy')).toEqual(false)
    })

    test('Admin can see other profile ', () => {
      getPermissions.mockReturnValue({
        'user.read': ['RESTRICTED_ROLE'],
        'user.admin': ['ADMIN']
      })

      expect(userPermission({
        id: 'abc',
        roles: ['ADMIN']
      }, 'read', '@jimmy')).toEqual(true)
    })

   
  })


  
  describe('Interaction permissions', () => {
    const mockPermissions = {
      'content.project.interactions.like.read': ['USER'],
      'content.project.interactions.like.update': ['SUPERVISOR'],
      'content.project.interactions.like.admin': ['ADMIN'],
      'user.user.interactions.follow.read': ['PUBLIC']
    }

    test('Public user has no permissions to read project likes', async () => {
      getPermissions.mockReturnValue(mockPermissions)
  
      expect(interactionPermission(null, 'content', 'project', 'like', 'read')).toEqual(false)
    })

    test('Logged user has permissions to read project likes', async () => {
      getPermissions.mockReturnValue(mockPermissions)
      const user = {
        roles: ['USER'],
        id: 'myid'
      }
  
      expect(interactionPermission(user, 'content', 'project', 'like', 'read')).toEqual(true)
    })

    test('Admin has permissions to read project likes', async () => {
      getPermissions.mockReturnValue(mockPermissions)
      const user = {
        roles: ['ADMIN'],
        id: 'myid'
      }
  
      expect(interactionPermission(user, 'content', 'project', 'like', 'read')).toEqual(true)
    })


    test('Public has permissions to read user follows', async () => {
      getPermissions.mockReturnValue(mockPermissions)
 
      expect(interactionPermission(null, 'user', 'user', 'follow', 'read')).toEqual(true)
    })

  })
})
 
