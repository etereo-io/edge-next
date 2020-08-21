import config from '@lib/config'
import { getDB } from '@lib/api/db'
import { ContentTypeDefinition, GroupEntityType, UserType } from '@lib/types'

type PaginationOptions = {
  from?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

type FindAllProps = {
  name: string
  type: string
  paginationOptions?: PaginationOptions
  options: object
}

export type Result = {
  data: GroupEntityType[] | ContentTypeDefinition[] | UserType[]
  type: string
  name: string
}

const {
  superSearch: { entities },
} = config

function getFieldsForShow(entityName: string): object {
  return (
    entities.find(({ name }) => name === entityName)?.fieldsForShow || []
  ).reduce((acc, field) => {
    acc[field] = 1

    return acc
  }, {})
}

export async function findAll(entities: FindAllProps[]): Promise<Result[]> {
  const promises: Result[] = []

  entities.forEach(({ type, name, paginationOptions = {}, options = {} }) => {
    const {
      from = 0,
      limit = 15,
      sortBy,
      sortOrder = 'DESC',
    } = paginationOptions

    const fields = getFieldsForShow(name)

    promises.push(
      getDB()
        .collection(name)
        .limit(limit)
        .start(from)
        .find(options, {
          sortBy,
          sortOrder,
          fields,
        })
        .then((data) => ({ type, data, name }))
    )
  })

  return Promise.all(promises)
}
