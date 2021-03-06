"use strict";
const path = require("path");
const utils = require("./utils");
const config = require("../config");
const vueLoaderConfig = require("./vue-loader.conf");
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { externals, cdn } = require("./add--cdn-externals");
const CDNPlugin = require("./cdn-plugin");
const html = require("./html");

const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "testing";
const PORT = process.env.PORT && Number(process.env.PORT);
const useThreads = isProd && config.build.parallel;

// eslint 解析规则
const eslint = () => [
  {
    test: /\.(js|vue)$/,
    loader: "eslint-loader",
    enforce: "pre",
    include: [utils.resolve("src"), utils.resolve("test")],
    options: {
      formatter: require("eslint-friendly-formatter"),
      emitWarning: !config.dev.showEslintErrorsInOverlay
    }
  }
];

module.exports = {
  entry: {
    app: "./src/main.ts"
  },
  output: {
    filename: "[name].js",
    publicPath: isProd
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // 添加 ts，tsx 后缀
    extensions: [
      ".js",
      ".vue",
      ".json",
      ".css",
      ".png",
      ".gif",
      ".bmp",
      ".wbp",
      ".scss",
      ".ts",
      ".tsx"
    ],
    alias: {
      "@": utils.resolve("src"),
      vue$: "vue/dist/vue.esm"
    }
  },
  module: {
    rules: [
      // 根据 vue-cli 来，根据参数判断是否载入eslint配置
      ...(config.dev.useEslint ? eslint() : []),
      {
        test: /\.tsx$/,
        enforce: "pre",
        loader: "tslint-loader",
        options: {
          // 出错中断编译
          failOnHint: true
        }
      },
      {
        test: /\.tsx?$/,
        use: [
          cache("ts"),
          ...(useThreads
            ? [
                {
                  loader: "thread-loader"
                }
              ]
            : []),
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              happyPackMode: useThreads,
              appendTsxSuffixTo: [/\.vue$/]
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        use: [
          cache("babel"),
          ...(useThreads
            ? [
                {
                  loader: "thread-loader"
                }
              ]
            : []),
          {
            loader: "babel-loader"
          }
        ],
        include: [utils.resolve("src"), utils.resolve("test")]
      },
      {
        test: /\.vue$/,
        use: [
          cache("vue"),
          {
            loader: "vue-loader",
            options: vueLoaderConfig
          }
        ],
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("images/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("media/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
        }
      }
    ]
  },
  // 设定浏览器环境下对node一些参数的响应方式。
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  },
  externals: {
    ...externals
  },
  // webpack 4 提供的mode 模式 production/development，有默认配置，具体参考官方文档。
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  plugins: [
    // webpack自动引入包，并注入到全局，省略 import xxx from "xxx" 写法
    new webpack.ProvidePlugin({
      ...(config.provide || {})
    }),
    // vue-loader 15.x 必须要引入的一个东东
    new VueLoaderPlugin(),
    new ForkTsCheckerWebpackPlugin({
      vue: true,
      tslint: config.tslint && utils.resolve("tslint.json"),
      formatter: "codeframe",
      // https://github.com/TypeStrong/ts-loader#happypackmode-boolean-defaultfalse
      checkSyntacticErrors: useThreads,
      silent: false,
      logger: { error: console.error, warn: () => {}, info: () => {} }
    }),
    ...(!isTest
      ? [
          html,
          // cdn 插件
          new CDNPlugin({
            cdn,
            chunk: true
          })
        ]
      : [])
  ]
};

function cache(name) {
  return {
    loader: "cache-loader",
    options: utils.cacheConfig(name)
  };
}
