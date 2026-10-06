import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Only the pure modules are tested here (no React Native runtime): the quiz
// payload builders, checkout helpers, copy parity, route mapping. Screens are
// checked in the Expo web preview and on a device.
const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
      'expo-constants': path.resolve(root, 'test/expo-constants.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
