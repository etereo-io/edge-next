export function hidePrivateUserFields(user) {
  if (!user) {
    return {}
  }

  const { username, profile, metadata, id } = user

  return {
    username,
    profile,
    metadata: metadata || {},
    id,
  }
}
