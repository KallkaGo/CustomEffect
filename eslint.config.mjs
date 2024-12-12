import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: 'prettier',
  },
  rules: {
    'no-unused-imports/no-unused-imports': 'warn',
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: true,
      },
    ],
  },
  overrides: [  
    {  
      files: ['public/**/*'],
    },  
  ],  
})
