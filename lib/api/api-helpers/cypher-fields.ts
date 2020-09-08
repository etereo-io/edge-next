import crypto from 'crypto'

import { FieldType, UserType } from '@lib/types'
import { cypheredFieldPermission } from '@lib/permissions'

const ENCRYPTION_KEY = process.env.CYPHER_SECRET // Must be 256 bits (32 characters)
const IV_LENGTH = 16 // For AES, this is always 16
const algorithm = 'aes-256-cbc'

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY),
    iv
  )
  let encrypted = cipher.update(text)

  encrypted = Buffer.concat([encrypted, cipher.final()])

  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

function decrypt(text) {
  const textParts = text.split(':')
  const iv = Buffer.from(textParts.shift(), 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY),
    iv
  )
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

export function cypherData(fields: FieldType[], data: { [ket: string]: any }) {
  const cypheredData = { ...data }

  fields.forEach(({ name, cypher: { enabled } = {} }) => {
    if (enabled && cypheredData[name]) {
      cypheredData[name] = encrypt(cypheredData[name])
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
        // decrypt data only if user has permission or he is the author of the post/group/ profile owner
        if (
          canSee ||
          item?.author === user?.id ||
          (entity === 'user' && item.id === user?.id)
        ) {
          try {
            if (entity === 'user') {
              cypheredData[index].profile[name] = decrypt(item.profile[name])
            } else {
              cypheredData[index][name] = decrypt(item[name])
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
