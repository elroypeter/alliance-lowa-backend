module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'linebreak-style': ['error', 'unix'],
        'max-len': ['error', { code: 2000, ignoreUrls: true }],
        'no-console': [
            'warn',
            {
                allow: ['info', 'error', 'warn'],
            },
        ],
        semi: 'off',
        'comma-dangle': 'off',
        'space-before-function-paren': 'off',
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                trailingComma: 'all',
                printWidth: 2000,
                tabWidth: 4,
            },
        ],
    },
};
