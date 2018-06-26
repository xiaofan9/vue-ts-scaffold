"use strict";
const utils = require("./utils");
const webpack = require("webpack");
const path = require("path");
const config = require("../config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const portfinder = require("portfinder");
const multipage = require("./multipage");

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  devServer: {
    clientLogLevel: "warning",
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.join(config.dev.assetsPublicPath, "index.html")
        }
      ]
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    }
  },
  plugins: [
    // 设置运行环境，默认设置为开发环境
    // new webpack.DefinePlugin({
    //   "process.env": config.dev.env
    // }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    // 热加载插件，vue好像必要要开启
    new webpack.HotModuleReplacementPlugin(),
    // HMR更新时在控制台中显示正确的文件名。已废弃，使用optimization.namedModules替代，开发环境自动启动
    // new webpack.NamedModulesPlugin(),
    // 已废弃，使用optimization.noEmitOnErrors 替代，生产环境默认开启，编译错误时，跳过输出阶段，好像由于webpack-dev-server禁止了输出，开不开没关系了。
    // new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    ...(config.multipage
      ? multipage.html
      : [
          new HtmlWebpackPlugin({
            filename: "index.html",
            template: "index.html",
            inject: true
          })
        ]),
    // 复制自定义静态文件夹
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../static"),
        to: config.dev.assetsSubDirectory,
        ignore: [".*"]
      }
    ])
  ]
});

module.exports = devWebpackConfig;
