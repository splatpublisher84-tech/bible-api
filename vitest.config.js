const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    globalSetup: './tests/setup.js',
  },
});
