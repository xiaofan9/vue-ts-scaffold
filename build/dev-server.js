"use strict";
require("./check-versions")();

const config = require("../config");
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

const net = require("net");
const opn = require("opn");
const path = require("path");
const express = require("express");
const webpack = require("webpack");
const proxyMiddleware = require("http-proxy-middleware");
const webpackConfig =
  process.env.NODE_ENV === "testing" || process.env.NODE_ENV === "production"
    ? require("./webpack.prod.conf")
    : require("./webpack.dev.conf");

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port;

// 检测端口是否被占用
function portIsOccupied(port) {
  return new Promise(function(resolve, reject) {
    // 创建服务并监听该端口
    const server = net.createServer().listen(port);

    server.on("listening", function() {
      // 执行这块代码说明端口未被占用
      server.close(); // 关闭服务

      resolve(port);
    });

    server.on("error", async function(err) {
      if (err.code === "EADDRINUSE") {
        // 端口已经被使用
        // reject(~~port + 1);
        resolve(await portIsOccupied(~~port + 1));
      } else {
        return reject(err);
        console.log("port 端口已经被使用");
      }
    });
  });
}

// 是否自动打开浏览器
const autoOpenBrowser = !!config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable;

const app = express();
const compiler = webpack(webpackConfig);

const devMiddleware = require("webpack-dev-middleware")(compiler, {
  publicPath: webpackConfig.output.publicPath,
  logLevel: "silent"
});

const hotMiddleware = require("webpack-hot-middleware")(compiler, {
  log: false,
  heartbeat: 2000
});
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
  let options = proxyTable[context];
  if (typeof options === "string") {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
app.use(require("connect-history-api-fallback")());

// serve webpack bundle output
app.use(devMiddleware);

// serve pure static assets
const staticPath = path.posix.join(
  config.dev.assetsPublicPath,
  config.dev.assetsSubDirectory
);
app.use(staticPath, express.static("./static"));

const uri = "http://localhost:" + port;

let _resolve;
let _reject;
const readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve;
  _reject = reject;
});

let server;
const portfinder = require("portfinder");
portfinder.basePort = port;

console.log("> Starting dev server...");
devMiddleware.waitUntilValid(async () => {
  const port_ = await portIsOccupied(port);

  if (port_ !== port) {
    portfinder.basePort = port_;
    console.log(
      "你设置的" + port + "端口已被占用，将自动改为" + port_ + "端口\n"
    );
  }

  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err);
    }
    process.env.PORT = port;
    const uri = "http://localhost:" + port;
    console.log("> Listening at " + uri + "\n");
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== "testing") {
      opn(uri);
    }
    server = app.listen(port);
    _resolve();
  });
});

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close();
  }
};
