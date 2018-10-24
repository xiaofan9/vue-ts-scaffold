// "use strict";
// const utils = require("./utils");
// const config = require("../config");
// const isProduction = process.env.NODE_ENV === "production";
// const sourceMapEnabled = isProduction
//   ? config.build.productionSourceMap
//   : config.dev.cssSourceMap;

module.exports = {
  // 15+ 版本不需要
  // loaders: Object.assign(
  //   {},
  //   utils.cssLoaders({
  //     sourceMap: isProduction
  //       ? config.build.productionSourceMap
  //       : config.dev.cssSourceMap,
  //     extract: isProduction
  //   })
  // ),
  // 在模版编译过程中，编译器可以将某些属性，如 src 路径，转换为 require 调用，以便目标资源可以由 webpack 处理
  transformAssetUrls: {
    video: "src",
    source: "src",
    img: "src",
    image: "xlink:href"
  },
  // 模板编译器的选项
  compilerOptions: {
    preserveWhitespace: false
  }
};
