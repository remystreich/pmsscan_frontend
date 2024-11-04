import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
   plugins: [react()],
   test: {
      environment: 'jsdom',
      setupFiles: ['./src/setup.ts'],
      globals: true,
      coverage: {
         provider: 'v8',
         reporter: ['text', 'json', 'html'],
         reportsDirectory: './coverage',
         exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.test.{ts,tsx}', '**/setupTests.ts'],
      },
   },
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src'),
      },
   },
});
