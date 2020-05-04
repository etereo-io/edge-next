import { forComment, forContent, forUser } from './has-permission.middleware'

import queryParameters from './has-query-parameters.middleware'
import recaptcha from './recaptcha.middleware'
import validContentType from './is-valid-content-type.middleware'

export const isValidContentType = validContentType
export const hasQueryParameters = queryParameters
export const hasPermissionsForContent = forContent
export const hasPermissionsForComment = forComment
export const hasPermissionsForUser = forUser
export const isValidRecaptcha = recaptcha
