"use strict";
const utils = require("./utils");
const webpack = require("webpack");
const path = require("path");
const config = require("../config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const portfinder = require("portfinder");
const OpenBrowserPlugin = require("./open-browser-plugin");
const CDNPlugin = require("./cdn-plugin");
const chalk = require("chalk");
const { cdn } = require("./add--cdn-externals");

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap
    })
  },
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
    host: process.env.HOST || config.dev.host,
    port: (process.env.PORT && Number(process.env.PORT)) || config.dev.port,
    // open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? {
          warnings: false,
          errors: true
        }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    }
  },
  plugins: [
    // 热加载插件，vue好像必要要开启
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true
    }),
    // cdn 插件，依赖于HtmlWebpackPlugin插件
    new CDNPlugin({
      cdn: cdn,
      chunk: true
    }),
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

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      let host;
      let isOpen = config.dev.autoOpenBrowser;

      if (config.dev.host === "0.0.0.0") {
        host = require("./ip").ip().address;
      }

      let local = host
        ? `\r\n\r\n    - Local:   ${chalk.cyan(
            `http://localhost:${port}${getPathName(config.dev.pathName)}`
          )}\r\n    - Network: `
        : ": ";

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here${local}${chalk.cyan(
                `http://${host || config.dev.host}:${port}${getPathName(
                  config.dev.pathName
                )}`
              )}\r\n`
            ]
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        })
      );

      if (isOpen) {
        let host_ = host ? "localhost" : config.dev.host;

        devWebpackConfig.plugins.push(
          new OpenBrowserPlugin(isOpen, host_, port, config.dev.pathName)
        );
      }

      resolve(devWebpackConfig);
    }
  });
});

function getPathName(pathName = "") {
  if (pathName.indexOf("/") === 0) {
    return pathName;
  }

  if (pathName === "") {
    return "";
  }

  return "/" + pathName;
}
