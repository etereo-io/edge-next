import { forContent, forGroup, forUser } from './has-permission.middleware'

import parser from './bodyparser.middleware'
import queryParameters from './has-query-parameters.middleware'
import recaptcha from './recaptcha.middleware'
import user from './load-user.middleware'
import validContentType from './is-valid-content-type.middleware'

export const isValidContentType = validContentType
export const hasQueryParameters = queryParameters
export const hasPermissionsForContent = forContent
export const hasPermissionsForUser = forUser
export const hasPermissionsForGroup = forGroup
export const isValidRecaptcha = recaptcha
export const bodyParser = parser
export const loadUser = user
export * from './group.middlewares'
