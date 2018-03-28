"use strict";
const path = require("path");
const utils = require("./utils");
const config = require("../config");
const vueLoaderConfig = require("./vue-loader.conf");
const webpack = require("webpack");
const os = require("os");
const HappyPack = require("happypack");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

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
    enforce: "pre",
    options: {
      failOnHint: true
    }
  },
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      "babel-loader",
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
    publicPath:
      process.env.NODE_ENV === "production"
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },
  resolve: {
    // 添加 ts，tsx 后缀
    extensions: [".js", ".vue", ".json", ".ts", ".tsx"],
    alias: {
      "@": resolve("src")
    }
  },
  module: {
    rules: [
      // 根据 vue-cli 来，根据参数判断是否载入eslint配置
      ...(config.dev.useEslint ? eslint() : []),
      ...(config.ts ? ts() : []),
      {
        test: /\.js$/,
        loader: "babel-loader",
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
    new webpack.ProvidePlugin({
      _: "lodash"
    }),
    new HappyPack({
      id: "babel",
      loaders: ["babel-loader", "vue-loader", "ts-loader"],
      threadPool: happyThreadPool,
      verbose: false
    }),
    new HappyPack({
      id: "styles",
      threadPool: happyThreadPool,
      loaders: [
        "vue-style-loader",
        "css-loader",
        "sass-loader",
        "postcss-loader"
      ],
      verbose: false
    })
  ]
};
