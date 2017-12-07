module.exports = {
  extends: 'airbnb',

  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  globals: {
    __static: true
  },
  rules: {
    "no-unused-vars": 1,
    "arrow-body-style": 0,
    "no-param-reassign": 1,
    "class-methods-use-this": 0,
    "import/prefer-default-export": 1,
    "max-len": [1, 150],
    "no-plusplus": 0,
    "no-mixed-operators": 1,
  }
};