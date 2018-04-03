"use strict";
const path = require("path");
const utils = require("./utils");
const config = require("../config");
const vueLoaderConfig = require("./vue-loader.conf");
const webpack = require("webpack");
const os = require("os");
const HappyPack = require("happypack");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });
const isProduction = process.env.NODE_ENV === "production";
const externals = isProduction ? config.build.externals : config.dev.externals;

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

// typescript 解析规则
const ts = () => [
  {
    test: /\.tsx?$/,
    loader: "tslint-loader",
    exclude: /node_modules/,
    include: [resolve("src")],
    enforce: "pre",
    options: {
      failOnHint: true
    }
  },
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    include: [resolve("src")],
    use: [
      "babel-loader?cacheDirectory=true",
      {
        loader: "ts-loader",
        options: { appendTsxSuffixTo: [/\.vue$/] }
      }
    ]
  }
];

module.exports = {
  entry: {
    // 根据配置文件判断是否载入 ts
    app: config.ts ? "./src/main.ts" : "./src/main.js"
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
      ...(config.ts ? ts() : []),
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
  plugins: [
    // webpack自动引入包，并注入到全局，省略 import xxx from "xxx" 写法
    new webpack.ProvidePlugin({
      ...provide
    }),
    new HappyPack({
      id: "babel",
      loaders: [
        "babel-loader",
        "vue-loader",
        ...(config.ts ? ["ts-loader"] : [])
      ],
      threadPool: happyThreadPool,
      verbose: false
    }),
    new HappyPack({
      id: "styles",
      threadPool: happyThreadPool,
      loaders: ["vue-style-loader", "css-loader", "postcss-loader"],
      verbose: false
    })
  ]
};
