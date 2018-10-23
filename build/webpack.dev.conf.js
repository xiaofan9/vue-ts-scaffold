"use strict";
const utils = require("./utils");
const webpack = require("webpack");
const path = require("path");
const config = require("../config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const multipage = require("./multipage");

Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ["./build/dev-client"].concat(
    baseWebpackConfig.entry[name]
  );
});

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap
    })
  },
  devtool: config.dev.devtool,
  plugins: [
    // 热加载插件，vue好像必要要开启
    new webpack.HotModuleReplacementPlugin(),
    ...multipage.html,
    // 复制自定义静态文件夹
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, "../static"),
      to: config.dev.assetsSubDirectory,
      ignore: [".*"]
    }])
  ]
});

module.exports = devWebpackConfig;
