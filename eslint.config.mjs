import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

export default [
    {
        ignores: ['**/dist/**', '**/node_modules/**', '**/.pnpm/**'],
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: [
            'packages/core/**/*.ts',
            'packages/core/**/*.tsx',
            'packages/cli/**/*.ts',
            'packages/cli/**/*.tsx',
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
            globals: {
                ...globals.node,
            },
        },
    },

    ...pluginVue.configs['flat/strongly-recommended'],
    {
        files: ['packages/vue/**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions: ['.vue'],
            },
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/no-v-html': 'off',
        },
    },
]
