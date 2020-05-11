import { FIELDS } from '../../../lib/config/config-constants'
import Image from '../image/image'
import ReactPlayer from 'react-player'
import TagsField from '../tags-field/tags-field'

function Field({ field, value, showLabel = false, contentType}) {
  const getField = (field, value) => {
    const datatestId = `${field.type}-${field.name}`

    switch (field.type) {
      case FIELDS.TEXTAREA:
        return (
          <p data-testid={datatestId} style={{ wordBreak: 'break-all' }}>
            {value}
          </p>
        )

      case FIELDS.IMAGE:
        return value ? (
          <div
            data-testid={datatestId}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Image width={500} height={500} srcs={value.map(i => i.path)} />{' '}
          </div>
        ) : null

      case FIELDS.NUMBER:
        return <p data-testid={datatestId}>{value}</p>

      case FIELDS.FILE:
        return <p data-testid={datatestId}>{value}</p>

      case FIELDS.TAGS:
        return (
          <div data-testid={datatestId}>
            <TagsField tags={value} type={contentType} />
          </div>
        )

      case FIELDS.VIDEO_URL:
        return value ? (
          <div data-testid={datatestId}>
            <ReactPlayer url={value} />
          </div>
        ) : null

      default:
        return <p data-testid={datatestId}>{value}</p>
        break
    }
  }

  return (
    <div className={`field-view`}>
      {field.label && showLabel && <label>{field.label}</label>}

      {getField(field, value)}
    </div>
  )
}

export default Field
