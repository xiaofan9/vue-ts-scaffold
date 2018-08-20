"use strict";
const path = require("path");
const utils = require("./utils");
const config = require("../config");
const vueLoaderConfig = require("./vue-loader.conf");
const webpack = require("webpack");
const isProduction = process.env.NODE_ENV === "production";
const externals = isProduction ? config.build.externals : config.dev.externals;
const { VueLoaderPlugin } = require("vue-loader");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

const provide = isProduction ? config.build.provide : config.dev.provide;

// eslint 解析规则
const eslint = () => [
  {
    test: /\.(js|vue)$/,
    loader: "eslint-loader",
    enforce: "pre",
    include: [resolve("src"), resolve("test")],
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
    path: config.build.assetsRoot,
    filename: "[name].js",
    publicPath: isProduction
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // 添加 ts，tsx 后缀
    extensions: [".js", ".vue", ".json", ".ts", ".tsx"],
    alias: {
      "@": resolve("src"),
      vue$: "vue/dist/vue.esm"
    }
  },
  externals: {
    ...externals
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
          failOnHint: true
          // tsConfigFile: "../tslint.json"
        }
      },
      {
        test: /\.tsx?$/,
        include: [resolve("src")],
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: { appendTsxSuffixTo: [/\.vue$/] }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: "babel-loader?cacheDirectory=true",
        include: [resolve("src"), resolve("test")]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: vueLoaderConfig
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("img/[name].[hash:7].[ext]")
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
      },
      {
        test: /\.html$/,
        loader: "ejs-loader"
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
  // webpack 4 提供的mode 模式 production/development，有默认配置，具体参考官方文档。
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  plugins: [
    // webpack自动引入包，并注入到全局，省略 import xxx from "xxx" 写法
    new webpack.ProvidePlugin({
      ...provide
    }),
    // vue-loader 15.x 必须要引入的一个东东
    new VueLoaderPlugin()
  ]
};
