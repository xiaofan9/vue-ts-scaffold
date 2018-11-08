"use strict";
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const safeParser = require("postcss-safe-parser");
const path = require("path");

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? "#source-map" : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath("js/[name].[chunkhash:8].js"),
    chunkFilename: utils.assetsPath("js/[name].[chunkhash:8].js")
  },
  optimization: {
    // 压缩配置
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            ...(config.build.showLog
              ? {}
              : {
                  drop_debugger: true,
                  // drop_console: true,
                  pure_funcs: ["console.log", "console.info", "console.debug"]
                })
          }
        },
        sourceMap: config.build.productionSourceMap,
        parallel: config.build.parallel,
        cache: true
      }),
      // css 代码压缩
      new OptimizeCSSPlugin({
        // https://github.com/postcss/postcss/blob/master/README-cn.md#%E9%85%8D%E7%BD%AE%E9%80%89%E9%A1%B9
        cssProcessorOptions: config.build.productionSourceMap
          ? {
              parser: safeParser,
              map: {
                inline: false
              }
            }
          : {
              parser: safeParser
            }
      })
    ],
    // 采用splitChunks提取出entry chunk的chunk Group
    splitChunks: {
      cacheGroups: {
        // 处理入口chunk
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all", // "initial","async","all".配置之后只会选择对应于初始化代码块（只对入口文件处理）,按需加载代码块,或者是所有代码块
          name: "chunk-vendor"
        },
        // 处理异步引入的chunk
        async: {
          chunks: "async",
          minChunks: 2,
          name: "chunk-async"
        },
        common: {
          test: chunk =>
            path.resolve(chunk.context).includes(utils.resolve("src")),
          name: "chunk-common",
          chunks: "all",
          minChunks: 2
        }
      }
    },
    // 为每个入口提取出webpack runtime模块
    runtimeChunk: {
      name: "manifest"
    },
    nodeEnv: "production"
  },
  plugins: [
    // 提取css
    new MiniCssExtractPlugin({
      filename: utils.assetsPath("css/[name].[chunkhash:8].css"),
      chunkFilename: utils.assetsPath("css/[name].[chunkhash:8].css")
    }),
    // 模块不变，hash id 保持不变
    new webpack.HashedModuleIdsPlugin(),
    // 复制静态文件夹
    new CopyWebpackPlugin([
      {
        from: utils.resolve("static"),
        to: config.build.assetsSubDirectory,
        ignore: [".*"]
      }
    ])
  ]
});

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require("compression-webpack-plugin");

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      test: new RegExp(
        "\\.(" + config.build.productionGzipExtensions.join("|") + ")$"
      ),
      threshold: 10240,
      cache: true
    })
  );
}

if (config.build.serviceWork) {
  const { GenerateSW } = require("workbox-webpack-plugin");

  webpackConfig.plugins.push(
    new GenerateSW({
      cacheId: require("../package.json").name,
      clientsClaim: true, // Service Worker 被激活后使其立即获得页面控制权
      skipWaiting: true, // 强制等待中的 Service Worker 被激活
      runtimeCaching: [
        // 配置路由请求缓存 对应 workbox.routing.registerRoute
        {
          urlPattern: /.*\.js/, // 匹配文件
          handler: "networkFirst" // 网络优先
        },
        {
          urlPattern: /.*\.css/,
          handler: "staleWhileRevalidate", // 缓存优先同时后台更新
          options: {
            // 这里可以设置 cacheName 和添加插件
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
          handler: "cacheFirst", // 缓存优先
          options: {
            cacheName: require("../package.json").name + "--img-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60
            }
          }
        },
        {
          urlPattern: /.*\.html/,
          handler: "networkFirst"
        }
      ]
    })
  );
}

module.exports = webpackConfig;
