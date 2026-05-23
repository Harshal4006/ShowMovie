module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'Controllers/**/*.js',
    'Middleware/**/*.js',
    'Routes/**/*.js',
    'Models/**/*.js',
    'Services/**/*.js',
    'Utils/**/*.js',
  ],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
};
