import { defineConfig } from 'vitest/config';

export default defineConfig({
   test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './setupTests.ts',
      coverage: {
         provider: 'v8',
         reporter: ['text', 'json', 'html'],
         reportsDirectory: './coverage',
         exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.test.{ts,tsx}', '**/setupTests.ts'],
      },
   },
});
