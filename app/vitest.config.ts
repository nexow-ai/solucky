import { defineConfig } from 'vitest/config';

// Unit tests for the app's pure helpers; they do not need a Nuxt runtime.
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
  },
});
