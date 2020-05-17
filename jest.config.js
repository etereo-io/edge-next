// require('dotenv').config()
const { defaults } = require('jest-config')

module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.config.js',
  ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/public/',
    '/coverage/',
    'enzyme.js',
    '/jest.config.js',
    '/.next/',
  ],
  testMatch: ['<rootDir>/test/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/public/', '/coverage/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform',
    // '^.+\\.(css)$': '<rootDir>/test/config-jest/cssTransform.js',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '/public/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    "@lib(.*)$": "<rootDir>/lib/$1",
    "@components(.*)$": "<rootDir>/components/$1",
  },
}
