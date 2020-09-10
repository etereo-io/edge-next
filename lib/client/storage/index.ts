import { isClient } from '../utils'

function get(key: string, json?: boolean) {
  if (isClient()) {
    const item = window.localStorage.getItem(key)
  
    if (json) {
      try {
        return JSON.parse(item || '')
      } catch(e) {
        return null
      }
    } else {
      return item
    }
  }
  
  return null
}

function set(key: string, value: string) {
  if (isClient()) {
    return window.localStorage.setItem(key, value)
  }
  
  return null
}

function remove(key: string) {
  if (isClient()) {
    return window.localStorage.removeItem(key)
  }
  
  return null
}

export default {
  get,
  set,
  remove,
}
