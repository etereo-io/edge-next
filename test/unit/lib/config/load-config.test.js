import config from '../../../../empieza.config'
import loadConfig from '../../../../lib/config/load-config'

jest.mock('../../../../empieza.config.js')


describe('Load configuration file', () => {

  afterEach(() => {
    config.mockClear()
  })


  test('Should complain about missing required fields', async () => {

    config.mockReturnValueOnce({
      title: '',
      description: ''
    })

    expect(() => {
      const conf = loadConfig()
    })
    .toThrowError(/Invalid configuration file: Required site title/)
  })

  test('Should not throw when the config file is valid', async () => {

    config.mockReturnValueOnce({
      title: 'A valid config',
      description: 'This is the description',
    })

    expect(() => {
      const conf = loadConfig()
    })
    .not.toThrow()
  })

})
