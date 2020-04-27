// optional: configure or set up a testing framework before each test
// if you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// used for __tests__/testing-library.js
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'

// Mock intersection observer globally (https://stackoverflow.com/questions/44249985/js-testing-code-that-uses-an-intersectionobserver)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  observe() {
    return null
  }

  unobserve() {
    return null
  }
}
