import { AES, enc } from 'crypto-js'
import { FieldType, UserType } from '@lib/types'
import { cypheredFieldPermission } from '@lib/permissions'

const secretKey = process.env.CYPHER_SECRET

export function cypherData(fields: FieldType[], data: { [ket: string]: any }) {
  const cypheredData = { ...data }

  fields.forEach(({ name, cypher: { enabled } = {} }) => {
    if (enabled && cypheredData[name]) {
      cypheredData[name] = AES.encrypt(cypheredData[name], secretKey).toString()
    }
  })

  return cypheredData
}

export function getDecipheredData(
  {
    entity,
    type,
    fields,
  }: { entity: string; type: string; fields: FieldType[] },
  data,
  user: UserType
) {
  const cypheredData = [...data]

  fields.forEach(({ name, cypher: { enabled } = {} }) => {
    if (enabled) {
      const canSee = cypheredFieldPermission(user, entity, type, name)

      cypheredData.forEach((item, index) => {
        if (
          canSee ||
          item?.author === user?.id ||
          (entity === 'user' && item.id === user?.id)
        ) {
          try {
            if (entity === 'user') {
              const bytes = AES.decrypt(item.profile[name], secretKey)

              cypheredData[index].profile[name] = bytes.toString(enc.Utf8)
            } else {
              const bytes = AES.decrypt(item[name], secretKey)

              cypheredData[index][name] = bytes.toString(enc.Utf8)
            }
          } catch (e) {
            return item
          }
        }
      })
    }
  })

  return cypheredData
}
