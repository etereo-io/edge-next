export const GROUP_USER_PERMITTED_FIELDS = ['id', 'username', 'roles', 'email']

export function getPermittedFields(
  user
): Partial<{ id: string; username: string; email: string; roles: string[] }> {
  return Object.entries(user).reduce((acc, [key, value]) => {
    if (GROUP_USER_PERMITTED_FIELDS.includes(key)) {
      acc[key] = value
    }

    return acc
  }, {})
}
