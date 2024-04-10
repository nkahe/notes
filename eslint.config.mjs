import globals from "globals";
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
  {
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      'indent': ['error', 2],
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': [
        'error',
        'unix'
      ],
      'eqeqeq': 'error'
    }
  },
  { ignores: [ "dist/*" ] },
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser }},
];