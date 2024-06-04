import globals from 'globals';

import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';

import jsdoc from 'eslint-plugin-jsdoc';
import html from 'eslint-plugin-html';
import ava from 'eslint-plugin-ava';

export default [
  // Replaces .eslintignore
  {
    ignores: [
      '**/*.min.js',
      'common/',
      'content/patterns/landmarks/examples/js/visua11y.js', // cspell:ignore visua
      'content/shared/js/highlight.pack.js',
      'content/shared/js/skipto.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],

    languageOptions: {
      ecmaVersion: 2021,
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: false,
        },
      },
      globals: {
        ...globals.browser,
      },
      sourceType: 'script',
    },

    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },

    plugins: {
      jsdoc: jsdoc,
    },

    rules: {
      ...jsdoc.configs.recommended.rules,
      'jsdoc/no-undefined-types': 'off',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/tag-lines': ['warn', 'any', { startLines: 1 }],
      'no-console': 'error',
      // https://eslint.org/docs/latest/use/migrate-to-9.0.0#no-unused-vars, but can be fixed
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      strict: [2, 'global'],
    },
  },
  {
    files: ['test/**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      ava: ava,
    },

    rules: {
      ...ava.configs.recommended.rules,
      'no-restricted-properties': [
        2,
        {
          property: 'findElements',
          message: 'Please use t.context.queryElements().',
        },
      ],
      strict: 'off',
    },
  },
  {
    files: ['scripts/*.js', '.link-checker.js'],

    languageOptions: {
      parser: babelParser,
      ecmaVersion: 'latest',
      parserOptions: {
        requireConfigFile: false,
      },
      globals: {
        ...globals.node,
      },
    },

    rules: {
      'no-console': 'off',
      strict: 'off',
    },
  },
  {
    files: ['**/*.html'],

    languageOptions: {
      globals: {
        sourceCode: true,
      },
    },

    plugins: {
      html: html,
    },
  },
  {
    files: ['**/*.mjs'],

    languageOptions: { sourceType: 'module' },
  },
];
