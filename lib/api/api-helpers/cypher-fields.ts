import crypto from 'crypto'

import { FieldType, UserType } from '@lib/types'
import { cypheredFieldPermission } from '@lib/permissions'

class CypherFields {
  constructor(
    private readonly secret: string,
    private readonly algorithm: string,
    private readonly ivLength: number
  ) {}

  encrypt(text) {
    const iv = crypto.randomBytes(this.ivLength)
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.secret),
      iv
    )
    let encrypted = cipher.update(text)

    encrypted = Buffer.concat([encrypted, cipher.final()])

    return iv.toString('hex') + ':' + encrypted.toString('hex')
  }

  decrypt(text) {
    const textParts = text.split(':')
    const iv = Buffer.from(textParts.shift(), 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.secret),
      iv
    )
    let decrypted = decipher.update(encryptedText)

    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString()
  }

  cypherData(fields: FieldType[], data: { [ket: string]: any }) {
    const cypheredData = JSON.parse(JSON.stringify({ ...data }))

    fields.forEach(({ name, cypher: { enabled } = {} }) => {
      if (enabled && cypheredData[name]) {
        cypheredData[name] = this.encrypt(`${cypheredData[name]}`)
      }
    })

    return cypheredData
  }

  getDecipheredData(
    {
      entity,
      type,
      fields,
    }: { entity: string; type: string; fields: FieldType[] },
    data,
    user: UserType
  ) {
    const cypheredData = JSON.parse(JSON.stringify([...data]))

    fields.forEach(({ name, cypher: { enabled } = {} }) => {
      if (enabled) {
        const canSee = cypheredFieldPermission(user, entity, type, name)

        cypheredData.forEach((item, index) => {
          // decrypt data only if user has permission or he is the author of the post/group/ profile owner
          if (
            canSee ||
            item?.author === user?.id ||
            (entity === 'user' && item.id === user?.id)
          ) {
            try {
              if (entity === 'user') {
                cypheredData[index].profile[name] = this.decrypt(
                  item.profile[name]
                )
              } else {
                cypheredData[index][name] = this.decrypt(item[name])
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
}

const cypher = new CypherFields(
  process.env.CYPHER_SECRET || 'this-is-a-secret-value-with-32ch',
  'aes-256-cbc',
  16
)

export default cypher

export const cypherData = cypher.cypherData.bind(cypher)
export const getDecipheredData = cypher.getDecipheredData.bind(cypher)
