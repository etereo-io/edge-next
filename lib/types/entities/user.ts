export type UserType = {
  username: string
  id: string
  salt: string
  hash: string
  email: string
  roles: string[]
  facebook?: string
  passwordResetToken?: string
  google?: string
  blocked?: boolean
  github?: string
  emailVerified?: boolean
  emailVerificationToken?: string
  createdAt: number
  profile: {
    displayName: string
    cover?: {
      path: string
    }
    picture: {
      path: string
      source: string
    },
    bio?: string
    facebook?: string
    twitter?: string
    github?: string
  }
  tokens: Array<{ [key: string]: any }>
  metadata: {
    lastLogin?: number
    reported?: number
  }
}
