"use strict";
// Template version: 1.1.3
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require("path");

module.exports = {
  build: {
    env: require("./prod.env"),
    index: path.resolve(__dirname, "../dist/index.html"),
    assetsRoot: path.resolve(__dirname, "../dist"),
    assetsSubDirectory: "",
    assetsPublicPath: "/",
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    // css 源码映射
    productionSourceMap: true,
    // 外部依赖库配置  key 库名称 value window全局变量名称
    externals: {}
  },
  dev: {
    env: require("./dev.env"),
    port: process.env.PORT || 8080,
    host: "localhost",
    // 自动打开浏览器
    autoOpenBrowser: true,
    poll: false,
    errorOverlay: true,
    assetsSubDirectory: "",
    assetsPublicPath: "/",
    proxyTable: {},
    notifyOnErrors: true,
    useEslint: false,
    devtool: "cheap-module-eval-source-map",
    // 显示eslint 错误到浏览器
    showEslintErrorsInOverlay: false,
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: true,
    // 外部依赖库配置  key 库名称 value window全局变量名称
    externals: {}
  },
  ts: false,
  multipage: true
};
