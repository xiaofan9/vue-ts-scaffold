const fs = require("fs");
const path = require("path");
const config = require("../config");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const isProd = process.env.NODE_ENV === "production";
const basePath = path.resolve(__dirname, "../src");

const modules = moduleNames();
const commonChunks = ["chunk-vendor", "chunk-async", "chunk-common", "manifest"];

let entry = {};
let html = [];

for (let module of modules) {
  entry[module] = isProd ? ["@babel/polyfill", path.resolve(basePath, `module/${module}/main`)] :
    path.resolve(basePath, `module/${module}/main`);

  html.push(
    new HtmlWebpackPlugin({
      filename: isProd ?
        path.resolve(__dirname, `../dist/${module}.html`) : `${module}.html`,
      template: path.resolve(basePath, `module/${module}/index.html`),
      inject: true,
      ...(isProd ? {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: "dependency"
      } : {}),
      chunks: [...commonChunks, module]
    })
  );
}

exports.html = html;
exports.entry = entry;
exports.modules = modules;
exports.commonChunks = commonChunks;

function moduleNames(path_ = "../src/module") {
  return fs.readdirSync(path.resolve(__dirname, path_));
}
