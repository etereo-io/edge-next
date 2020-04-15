import validContentType from './is-valid-content-type.middleware'
import queryParameters from './has-query-parameters.middleware'
import { forContent, forComment } from './has-permission.middleware'

export const isValidContentType = validContentType
export const hasQueryParameters = queryParameters
export const hasPermissionsForContent = forContent
export const hasPermissionsForComment = forComment