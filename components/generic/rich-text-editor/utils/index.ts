export function isEditorEmpty(value: string) {
  return value.replace(/(<([^>]+)>)/gi, '') === ''
}
