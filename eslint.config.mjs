import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPrettierRecommanded from "eslint-plugin-prettier/recommended";
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
            'packages/cli/**/*.ts',
            'packages/vue/**/*.ts',
            'packages/vue/**/*.vue',
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
    {
        extends: [eslintConfigPrettier],
    },
    eslintPluginPrettierRecommanded
]
