"use strict";
const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const utils = require("./utils");
const multipage = require("./multipage");
const baseWebpackConfig = require("./webpack.base.conf");
const config = require("../config");

Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = ["./build/dev-client"].concat(
    baseWebpackConfig.entry[name]
  );
});

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
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
