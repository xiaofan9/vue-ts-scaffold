const fs = require("fs");
const path = require("path");
const config = require("../config");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const isMoreOpt =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "testing";
const basePath = path.resolve(__dirname, "../src");

function moduleNames(path_ = "../src/module") {
  return fs.readdirSync(path.resolve(__dirname, path_));
}

const modules = moduleNames();
let entry = {};
let html = [];

for (let module of modules) {
  entry[module] = path.resolve(basePath, `module/${module}/main`);

  html.push(
    new HtmlWebpackPlugin({
      filename: isMoreOpt
        ? path.resolve(__dirname, `../dist/${module}.html`)
        : `${module}.html`,
      template: path.resolve(basePath, `module/${module}/index.html`),
      inject: true,
      ...(isMoreOpt
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true
            },
            chunksSortMode: "dependency"
          }
        : {}),
      chunks: ["vendor", "vendor-async", "manifest", "common", module]
    })
  );
}

exports.html = html;
exports.entry = entry;
