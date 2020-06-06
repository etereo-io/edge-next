import getPermissions from '../../../../lib/permissions/get-permissions'
import hasPermission from '../../../../lib/permissions/has-permission'

jest.mock('../../../../lib/permissions/get-permissions')

describe('Has Permission test', () => {
  afterEach(() => {
    getPermissions.mockReset()
  })

  test('Public user has no permissions', async () => {
    getPermissions.mockReturnValue({
      'content.project.read': ['USER']
    })

    expect(hasPermission(null, 'content.project.read')).toEqual(false)
  })

  
  test('Public user has  permissions', async () => {
    getPermissions.mockReturnValue({
      'content.project.read': ['PUBLIC']
    })

    expect(hasPermission(null, 'content.project.read')).toEqual(true)
  })

  test('Logged user has no permissions', async () => {
    getPermissions.mockReturnValue({
      'content.project.read': ['ADMIN']
    })

    expect(hasPermission({ roles: ['USER']}, 'content.project.read')).toEqual(false)
  })

  test('Logged user has permissions', async () => {
    getPermissions.mockReturnValue({
      'content.project.read': ['USER']
    })

    expect(hasPermission({ roles: ['USER']}, 'content.project.read')).toEqual(true)
  })

  
  test('Multiple roles ', async () => {
    getPermissions.mockReturnValue({
      'content.project.read': ['SHOP_OWNER', 'SHOP_VISITOR'],
      'content.create': ['SHOP_ADMIN']
    })

    expect(hasPermission({ roles: ['USER', 'SHOP_OWNER']}, 'content.project.read')).toEqual(true)
    expect(hasPermission({ roles: ['SHOP_ADMIN', 'SHOP_OWNER']}, 'content.create')).toEqual(true)
    expect(hasPermission({ roles: ['ANOTHER_ROLE', 'SHOP_OWNER']}, 'content.create')).toEqual(false)
  })

  test('Multiple permissions ', async () => {

    getPermissions.mockReturnValue({
      'content.project.read': ['SHOP_OWNER', 'SHOP_VISITOR'],
      'content.create': ['SHOP_ADMIN'],
      'content.admin': ['ADMIN'],
      'comment.read': ['COMMENT_READ_USER'],
      'another.permission': ['SHOP_OWNER']
    })

    // should return false if does not have any permission
    expect(hasPermission({ roles: ['COMMENT_READ_USER', 'SHOP_OWNER']}, ['content.create', 'content.admin'])).toEqual(false)
    
    // Should return true if has some permission
    expect(hasPermission({ roles: ['COMMENT_READ_USER', 'SHOP_OWNER']}, ['content.create', 'comment.read'])).toEqual(true)

    
  })
})
