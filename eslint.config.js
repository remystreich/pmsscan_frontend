import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tailwindcss from 'eslint-plugin-tailwindcss';
import globals from 'globals';

export default tseslint.config({
   files: ['**/*.{js,jsx,ts,tsx}'],
   
   languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
         project: ['./tsconfig.app.json', './tsconfig.node.json'],
         tsconfigRootDir: import.meta.dirname,
      },
      globals: {
         ...globals.browser,
         ...globals.es2021,
         ...globals.node,
      },
   },

   plugins: {
      react,
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      tailwindcss,
   },

   settings: {
      react: {
         version: '18.3',
      },
   },

   rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommendedTypeChecked.rules,
      ...tseslint.configs.stylisticTypeChecked.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...tailwindcss.configs.recommended.rules,
      ...eslintConfigPrettier.rules,

      // Règles personnalisées
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      'import/order': [
         'error',
         {
            'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            'newlines-between': 'always',
            'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
         }
      ],
      'no-console': 'warn',
      'no-duplicate-imports': 'error',
      'prefer-const': 'warn',
   },
});
