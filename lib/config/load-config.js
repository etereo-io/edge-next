import config from '../empieza.config'
import { languages } from './locale'
import schema from './config.schema'

const defaultConfig = {
  languages
}

export default function load() {
    
  try {
    const newConfig = config(defaultConfig)
    
    const { error, value } = schema.validate(newConfig)

    if (error) {
      throw error
    } else {
      return value
    }
  } catch (e)  {
    throw new Error('Invalid configuration file', e)
  }

}