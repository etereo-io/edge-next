import { forComment, forContent, forUser } from './has-permission.middleware'

import dynamicFields from './dynamic-fields-formidable.middleware'
import queryParameters from './has-query-parameters.middleware'
import recaptcha from './recaptcha.middleware'
import validContentType from './is-valid-content-type.middleware'

export const isValidContentType = validContentType
export const hasQueryParameters = queryParameters
export const hasPermissionsForContent = forContent
export const hasPermissionsForComment = forComment
export const hasPermissionsForUser = forUser
export const isValidRecaptcha = recaptcha
export const dynamicFieldsFormidable = dynamicFields