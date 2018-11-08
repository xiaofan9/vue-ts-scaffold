const config = require("../config");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

// 生成html页面
module.exports = isProd
  ? new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true
    })
  : new HtmlWebpackPlugin({
      filename:
        process.env.NODE_ENV === "testing" ? "index.html" : config.build.index,
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
    });
