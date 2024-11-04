import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';

export default tseslint.config(
   { ignores: ['dist'] },
   {
      extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier],
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
         ecmaVersion: 2020,
         globals: {
            ...globals.browser,
            React: 'readonly',
         },
      },
      plugins: {
         'react-hooks': reactHooks,
         'react-refresh': reactRefresh,
         react,
      },
      settings: {
         react: { version: '18.3' },
      },
      rules: {
         ...reactHooks.configs.recommended.rules,
         ...react.configs.recommended.rules,
         ...react.configs['jsx-runtime'].rules,
         'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
         'react/prop-types': 'off',
         'react/jsx-uses-react': 'off',
         'react/react-in-jsx-scope': 'off',
         '@typescript-eslint/no-explicit-any': 'warn',
         '@typescript-eslint/explicit-function-return-type': 'off',
         '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
         'no-console': ['warn', { allow: ['warn', 'error'] }],
         'prefer-const': 'warn',
      },
   },
);
