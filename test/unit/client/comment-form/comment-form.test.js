import { extractUserMentions } from '../../../../components/comments/comment-form/comment-form'

describe('parse mentions test', () => {
  it('should return an empty mention list if there is no one', () => {
    const { parsedText, mentions } = extractUserMentions('a sd')

    expect(parsedText).toEqual('a sd')
    expect(mentions.length).toEqual(0)
  })

  it('should return all the mentions', () => {
    const { parsedText, mentions } = extractUserMentions('a @santi @pepe123, !@manuel, @thought-works-1234, @sa... @sa')

    
    expect(mentions.length).toEqual(5)

    expect(mentions.indexOf('@santi')).toEqual(0)
    expect(mentions.indexOf('@pepe123')).toEqual(1)
    expect(mentions.indexOf('@manuel')).toEqual(2)
    expect(mentions.indexOf('@thought-works-1234')).toEqual(3)
    expect(mentions.indexOf('@sa')).toEqual(4)
  })
})