import { FIELDS } from '../../../lib/config/config-constants'
import Image from '../image/image'
import MarkdownRead from '../markdown-read/markdown-read'
import ReactPlayer from 'react-player'
import TagsField from '../tags-field/tags-field'
import marked from 'marked'

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
      case FIELDS.MARKDOWN:
        const  htmlString = marked(value || '')
        return (
          <div data-testid={datatestId} style={{ wordBreak: 'break-all' }}>
            <MarkdownRead htmlString={htmlString} />
          </div>
        )
      case FIELDS.IMAGE:
        if (value && Array.isArray(value) ) {
          const transformedValues = value.map(i => i.isFile ? i.src : i.path)

            
          return (
          <div
            data-testid={datatestId}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Image width={500} height={500} srcs={transformedValues} />
          </div>
        )
        } else {
          return null
        }

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
