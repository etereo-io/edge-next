import { getConfig } from '../../../../edge.config'
import loadConfig from '../../../../lib/config/load-config'

jest.mock('../../../../edge.config')

describe('Load configuration file', () => {
  afterEach(() => {
    getConfig.mockClear()
  })

  test('Should complain about missing required fields', async () => {
    getConfig.mockReturnValueOnce({
      title: '',
      description: '',
    })

    expect(() => {
      const conf = loadConfig()
    }).toThrowError(/Invalid configuration file: Required site title/)
  })

  test('Should not throw when the config file is valid', async () => {
    getConfig.mockReturnValueOnce({
      title: 'A valid config',
      description: 'This is the description',
    })

    expect(() => {
      const conf = loadConfig()
    }).not.toThrow()
  })
})
