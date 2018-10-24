"use strict";
require("./check-versions")();

process.env.NODE_ENV = "production";

const ora = require("ora");
const rm = require("rimraf");
const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const config = require("../config");
const webpackConfig = require("./webpack.prod.conf");
const utils = require("./utils");
const format = require("./format-stats");
const ModernPlugin = require("./modern-plugin");
const merge = require("webpack-merge");

let isModern = false;
let isOnly = false;

process.argv.forEach(item => {
  if (item.includes("modern")) {
    isModern = true;
  }

  if (item.includes("only")) {
    isOnly = true;
  }
});

let spinner;

function logStart(str = "") {
  spinner = ora(`Building ${str}bundle for production...`);

  spinner.start();
}

function build(webpackConfig, str) {
  return new Promise(function (resolve, reject) {
    logStart(str);

    webpack(webpackConfig, function (err, stats) {
      spinner.stop();
      if (err) throw err;

      if (stats.hasErrors()) {
        console.log(stats.toString({
          colors: true
        }));

        console.log(chalk.red("\nBuild failed with errors.\n"));

        process.exit(1);
      }

      console.log(format(stats));

      resolve();
    });
  });
}

(async function () {
  rm(
    path.join(config.build.assetsRoot, config.build.assetsSubDirectory),
    async err => {
      if (err) throw err;
      let startTime = Date.now();

      if (isModern) {
        Reflect.deleteProperty(process.env, "MODERN_BUILD");

        webpackConfig.plugins.push(
          new ModernPlugin({
            targetDir: utils.resolve("dist"),
            only: isOnly
          }));

        if (!isOnly) {
          let legacy = merge(webpackConfig, {
            output: {
              ...webpackConfig.output,
              filename: utils.assetsPath("js/[name]-legacy.[chunkhash:8].js"),
              chunkFilename: utils.assetsPath("js/[name]-legacy.[chunkhash:8].js")
            }
          });

          await build(legacy, "legacy ");
        }

        process.env.MODERN_BUILD = "modern";

        let cache;
        let modern = merge(webpackConfig);

        if (config.build.bundleAnalyzerReport) {
          const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
            .BundleAnalyzerPlugin;

          modern.plugins.push(new BundleAnalyzerPlugin());
        }

        modern.module.rules.forEach(item => {
          if (item.test.toString().includes("js")) {
            cache = item;
          }
        });

        if (cache) {
          cache.use.forEach(item => {
            if (item.loader === "cache-loader" || item === "cache-loader") {
              if (typeof item === "string") {
                item = {
                  loader: "cache-loader",
                  options: utils.cacheConfig("babel")
                };
              } else {
                item.options = utils.cacheConfig("babel")
              }
            }
          })

          await build(modern, "modern ");

          Reflect.deleteProperty(process.env, "MODERN_BUILD");
        }

        // webpackConfig.module.rules[0].use[0].options.cacheIdentifier = utils.cacheConfig("babel").cacheIdentifier;

        // await build(webpackConfig, "modern");

        // Reflect.deleteProperty(process.env, "MODERN_BUILD");
      } else {
        if (config.build.bundleAnalyzerReport) {
          const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
            .BundleAnalyzerPlugin;

          webpackConfig.plugins.push(new BundleAnalyzerPlugin());
        }

        await build(webpackConfig);
      }

      console.log(
        chalk.green("Build complete in " + (Date.now() - startTime) + "ms.\n")
      );

      console.log(
        chalk.yellow(
          "Tip: built files are meant to be served over an HTTP/HTTPS server.\n" +
          "Opening index.html over file:// won't work.\n"
        )
      );
    }
  );
})();
