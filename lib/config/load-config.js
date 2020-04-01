import config from '../../empieza.config'
import { languages } from './locale'
import schema from './config.schema'

const defaultConfig = {
  languages,
}

export default function load() {
    
  try {
    console.log('loading configuration file')
    const newConfig = config(defaultConfig)
    
    schema.validateSync(newConfig, { abortEarly: false })

    return newConfig  
  } catch (e)  {
    console.log(e)
    throw new Error('Invalid configuration file', e)
  }

}