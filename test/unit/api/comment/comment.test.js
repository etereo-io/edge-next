import { parseCommentBody } from '../../../../pages/api/comments/[contentType]/[contentId]'

describe('parse mentions test', () => {
  it('should return an empty mention list if there is no one', () => {
    const { parsedText, mentions } = parseCommentBody('a sd')

    expect(parsedText).toEqual('a sd')
    expect(mentions.length).toEqual(0)
  })

  it('should return all the mentions, not duplicated', () => {
    const { parsedText, mentions } = parseCommentBody('a @santi @pepe123, !@manuel, @thought-works-1234, @sa... @sa')

    
    expect(mentions.length).toEqual(5)

    expect(mentions.indexOf('@santi')).toEqual(0)
    expect(mentions.indexOf('@pepe123')).toEqual(1)
    expect(mentions.indexOf('@manuel')).toEqual(2)
    expect(mentions.indexOf('@thought-works-1234')).toEqual(3)
    expect(mentions.indexOf('@sa')).toEqual(4)
  })

  it('should create links to profiles', () => {
    const { parsedText, mentions } = parseCommentBody('hello @friend')
    expect(parsedText).toEqual('hello [@friend](/profile/@friend)')
    expect(mentions.length).toEqual(1)
    expect(mentions[0]).toEqual('@friend')
  })

  it('should parse any image into a image', () => {
    const { parsedText, images } = parseCommentBody('https://something.com/image.jpeg hola')
    expect(parsedText).toEqual('![https://something.com/image.jpeg](https://something.com/image.jpeg) hola')
    expect(images.length).toEqual(1)
    expect(images[0]).toEqual('https://something.com/image.jpeg')
  })

  it('should parse images and mentions at the same time', () => {
    const { parsedText, images, mentions } = parseCommentBody('@hayder https://something.com/image.jpeg hola')
    expect(parsedText).toEqual('[@hayder](/profile/@hayder) ![https://something.com/image.jpeg](https://something.com/image.jpeg) hola')
    expect(images.length).toEqual(1)
    expect(images[0]).toEqual('https://something.com/image.jpeg')
    expect(mentions.length).toEqual(1)
    expect(mentions[0]).toEqual('@hayder')
  })
})