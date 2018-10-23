"use strict";

require("./check-versions")();

const config = require("../config");
const opn = require("opn");
const path = require("path");
const express = require("express");
const webpack = require("webpack");
const proxyMiddleware = require("http-proxy-middleware");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const portfinder = require("portfinder");
const http = require("http");
const webpackConfig = require("./webpack.dev.conf");
const utils = require("./utils");
const chalk = require("chalk");

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

let server;
let _resolve;
let _reject;
const readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve;
  _reject = reject;
});

let host;
if (config.dev.host === "0.0.0.0") {
  host = require("./ip").ip().address;
}

portfinder.basePort = process.env.PORT || config.dev.port;
portfinder.getPort((err, port) => {
  if (err) {
    reject(err);
  } else {
    process.env.PORT = port;

    let local = host ? `\r\n\r\n    - Local:   ${chalk.cyan(`http://localhost:${port}${getPathName(config.dev.pathName)}`)}\r\n    - Network: ` : ": ";

    webpackConfig.plugins.push(
      new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here${local}${chalk.cyan(`http://${ host || config.dev.host }:${port}${getPathName(config.dev.pathName)}`)}\r\n`]
        },
        onErrors: config.dev.notifyOnErrors ?
          utils.createNotifierCallback() : undefined
      })
    );

    createServer(port);
  }
});

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close();
  },
  createServer
};

function createServer(port) {
  console.log("> Starting dev server...");

  // / 是否自动打开浏览器
  const autoOpenBrowser = !!config.dev.autoOpenBrowser;

  const proxyTable = config.dev.proxyTable;

  const app = express();

  const compiler = webpack(webpackConfig);

  const devMiddleware = require("webpack-dev-middleware")(compiler, {
    publicPath: config.dev.assetsPublicPath,
    logLevel: "silent"
  });

  const hotMiddleware = require("webpack-hot-middleware")(compiler, {
    log: false,
    heartbeat: 2000
  });

  app.use(hotMiddleware);

  // proxy api requests
  Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context];
    if (typeof options === "string") {
      options = {
        target: options
      };
    }
    app.use(proxyMiddleware(options.filter || context, options));
  });

  app.use(require("connect-history-api-fallback")());

  app.use(devMiddleware);

  const staticPath = path.posix.join(
    config.dev.assetsPublicPath,
    config.dev.assetsSubDirectory
  );
  app.use(staticPath, express.static("./static"));

  devMiddleware.waitUntilValid(() => {
    const url =
      "http://" +
      (host ? "localhost" : config.dev.host) +
      ":" +
      port +
      getPathName(config.dev.pathName);

    if (autoOpenBrowser && process.env.NODE_ENV !== "testing") {
      opn(url);
    }

    server = http.createServer(app);

    server.listen(port, config.dev.host);

    _resolve();
  });
}

function getPathName(pathName = "") {
  if (pathName.indexOf("/") === 0) {
    return pathName;
  }

  if (pathName === "") {
    return "";
  }

  return "/" + pathName;
}
