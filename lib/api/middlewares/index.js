import { forComment, forContent, forUser } from './has-permission.middleware'

import queryParameters from './has-query-parameters.middleware'
import validContentType from './is-valid-content-type.middleware'
import recaptcha from './recaptcha.middleware'

export const isValidContentType = validContentType
export const hasQueryParameters = queryParameters
export const hasPermissionsForContent = forContent
export const hasPermissionsForComment = forComment
export const hasPermissionsForUser = forUser
export const isValidRecaptcha = recaptcha