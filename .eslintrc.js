// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module"
  },
  env: {
    browser: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: "standard",
  // required to lint *.vue files
  plugins: ["html", "vue"],
  globals: {},
  // add your custom rules here
  rules: {
    // allow async-await
    "no-callback-literal": 0,
    "generator-star-spacing": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    // 默认配置always，要求在行末加上分号。
    semi: ["error", "always"],
    quotes: ["warn", "double"],
    "space-before-function-paren": 0,
    "prefer-promise-reject-errors": 0,
    "no-new": 0,
    "no-eval": 0
  }
};
