module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'data/**/*.js',
    'services/**/*.js',
    '!**/node_modules/**'
  ],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  verbose: true
};
