import loadConfig from '../../../lib/config/load-config'

test('Loads configuration', () => {
  const config = loadConfig()
  expect(config.permissions).not.toBe(null)

  expect(config.permissions['admin.access'][0]).toBe('ADMIN')
})