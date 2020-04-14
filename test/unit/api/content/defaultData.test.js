import { fillContentWithDefaultData } from '../../../../pages/api/content/[type]'

test('Should create the default data for new content', () => {
  const contentType = {
    slug: 'the-content-type-slug',
    slugGeneration: ['img', 'title'],
    fields: [
      {
        name: 'img',
        defaultValue: 'xyz'
      }, {
        name: 'title',
        defaultValue: 'the title'
      }
    ]
  }
  const content = {}
  const user = {
    id: 'test-user'
  }

  const newContent = fillContentWithDefaultData(contentType, content, user)
  expect(newContent).toMatchObject({
    createdAt: expect.any(Number),
    author: expect.any(String),
    type: contentType.slug,
    slug: 'xyz-the-title',
    img: 'xyz',
    title: 'the title',
    id: expect.anything()
  })
})