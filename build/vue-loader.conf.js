"use strict";
const utils = require("./utils");
const config = require("../config");
const isProduction = process.env.NODE_ENV === "production";
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap;

module.exports = {
  loaders: Object.assign(
    utils.cssLoaders({
      sourceMap: isProduction
        ? config.build.productionSourceMap
        : config.dev.cssSourceMap,
      extract: isProduction
    }),
    config.ts
      ? {
          ts: "ts-loader",
          tsx: "babel-loader!ts-loader"
        }
      : {}
  ),
  cssSourceMap: sourceMapEnabled,
  // 在模版编译过程中，编译器可以将某些属性，如 src 路径，转换为 require 调用，以便目标资源可以由 webpack 处理
  transformToRequire: {
    video: "src",
    source: "src",
    img: "src",
    image: "xlink:href"
  }
};
