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
    assetsPublicPath: "./", // 该选项的值是以 runtime(运行时) 或 loader(载入时) 所创建的每个 URL 为前缀
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ["js", "css"],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    // css 源码映射
    productionSourceMap: true,
    // cdn 配置，key 库名称 value window 全局变量
    externals: {
      // "vue": {
      //   cdn: "",
      //   window: ""
      // }
      // "vue": "Vue" 需手动引入cdn 或在cdn数组中加入cdn链接
      // "vue": {
      //   cdn: "https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.17/vue.min.js",
      //   window: "Vue"
      // }
    },
    cdn: [],
    showLog: false // true：显示日志，false：不显示日志
  },
  dev: {
    env: require("./dev.env"),
    port: process.env.PORT || 8080,
    pathName: "",
    host: "localhost",
    // 自动打开浏览器
    autoOpenBrowser: false,
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
    cssSourceMap: true
  },
  test: {
    unit: true,
    // 代码覆盖率测试
    coverage: false
  },
  // 自动引入插件  key window全局变量 value 库名称
  provide: {},
  parallel: hasMultipleCores(),
  tslint: true
};

function hasMultipleCores() {
  try {
    return require('os').cpus().length > 1
  } catch (e) {
    return false
  }
}
