"use strict";
const path = require("path");
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const multipage = require("./multipage");

const env =
  process.env.NODE_ENV === "testing"
    ? require("../config/test.env")
    : config.build.env;

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
    filename: utils.assetsPath("js/[name].[chunkhash].js"),
    chunkFilename: utils.assetsPath("js/[id].[chunkhash].js")
  },
  optimization: {
    // 压缩配置
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            pure_funcs: ["console.log"]
          }
        },
        sourceMap: config.build.productionSourceMap,
        parallel: true
      })
    ],
    // 采用splitChunks提取出entry chunk的chunk Group
    splitChunks: {
      cacheGroups: {
        // 处理入口chunk
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "initial", // 只对入口文件处理
          name: "vendor"
        },
        // 处理异步chunk
        "vendor-async": {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,
          chunks: "async",
          name: "vendor-async"
        },
        common: {
          test(chunks) {
            return path
              .resolve(chunks.context)
              .includes(path.resolve(__dirname, "../src/common"));
          },
          chunks: "all",
          name: "common"
        }
      }
    },
    // 为每个入口提取出webpack runtime模块
    runtimeChunk: { name: "manifest" },
    nodeEnv: "production"
  },
  plugins: [
    // 设置运行环境，默认设置为生产环境
    // new webpack.DefinePlugin({
    //   "process.env": env
    // }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath("css/[name].[chunkhash].css"),
      chunkFilename: utils.assetsPath("css/[name].[chunkhash].css")
      // allChunks: true
    }),
    // 默认开启，内置optimization.minimize来压缩代码
    // new UglifyJsPlugin({
    //   uglifyOptions: {
    //     compress: {
    //       warnings: false,
    //       drop_console: true,
    //       pure_funcs: ["console.log"]
    //     }
    //   },
    //   sourceMap: config.build.productionSourceMap,
    //   parallel: true
    // }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    ...(config.multipage
      ? multipage.html
      : [
          new HtmlWebpackPlugin({
            filename:
              process.env.NODE_ENV === "testing"
                ? "index.html"
                : config.build.index,
            template: "index.html",
            inject: true,
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true
              // more options:
              // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: "dependency"
          })
        ]),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // 作用域提升，自动开启，已废弃使用 optimization.concatenateModules 替代 webpack.optimize.ModuleConcatenationPlugin(),
    /*
    已废弃使用，使用optimization.splitChunks和optimization.runtimeChunk来代替；
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: function(module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, "../node_modules")) === 0
        );
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      chunks: ["vendor"]
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),
    */

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../static"),
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
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: new RegExp(
        "\\.(" + config.build.productionGzipExtensions.join("|") + ")$"
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
