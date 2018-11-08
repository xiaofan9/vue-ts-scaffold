import Vue from "vue";
import {
  test
} from "../../config";

Vue.config.productionTip = false;

if (test.unit) {
  // require all test files (files that ends with .spec.js)
  // 1. 引入的文件目录；2.是否要查找该目录下的子级目录；3.匹配要引入的文件
  const testsContext = require.context("./specs", true, /\.spec$/);
  testsContext.keys().forEach(testsContext);
}

if (test.coverage) {
  // require all src files except main.js for coverage.
  // you can also change this to match only the subset of files that
  // you want coverage for.

  const srcContext = require.context(
    "../../src",
    true,
    /^\.\/(?!((main\.js)|(.*?\.d\.ts)|(.*?\.html))?$)/
  );

  srcContext.keys().forEach(srcContext);
}
