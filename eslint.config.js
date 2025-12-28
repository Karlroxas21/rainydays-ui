// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

const tseslintPlugin = require('@typescript-eslint/eslint-plugin');
const tseslintParser = require('@typescript-eslint/parser');

module.exports = defineConfig([
    expoConfig,
    {
        ignores: ['dist/*'],
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],

        // 4. Manually declare the parser and plugin
        languageOptions: {
            parser: tseslintParser,
            // You can also specify parser options here if needed, like project: ['./tsconfig.json']
        },
        plugins: {
            '@typescript-eslint': tseslintPlugin,
        },

        rules: {
            // Disable the base rule, as it can report incorrect errors with TypeScript
            'no-unused-vars': 'off',
            // Use the TypeScript-aware rule instead
            // We set it to 'error' and configure it to ignore variables/arguments
            // that start with an underscore (a common convention for "intentional unused").
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            'semi': ['error', 'always'],
        },
    },
]);
