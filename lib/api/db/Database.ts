import logger from '@lib/logger'

type ANY_OBJECT = {
  [key: string]: any
}

export default class Database {
  nativeDriver() {
    logger('ERROR', 'Native driver not implemented')
  }
  add(item: ANY_OBJECT) {
    logger('ERROR', 'Add not implemented')
  }

  find(options: ANY_OBJECT, otherOptions: ANY_OBJECT) {
    logger('ERROR', 'Find not implemented')
  }
  findOne(options: ANY_OBJECT) {
    logger('ERROR', 'Find one not implemented')
  }
  doc(id: string | number) {
    logger('ERROR', 'Doc not implemented')
  }
  collection(name: string): Database {
    logger('ERROR', 'Collection not implemented')

    return this
  }
  limit(num: number | string): Database {
    logger('ERROR', 'Limit not implemented')

    return this
  }
  start(num: number | string): Database {
    logger('ERROR', 'Start not implemented')

    return this
  }
  count(options: ANY_OBJECT) {
    logger('ERROR', 'Count not implemented')
  }

  remove(options: ANY_OBJECT, onlyOne: boolean) {
    logger('ERROR', 'Remove not implemented')
  }
}
