"use strict";
const path = require("path");
const config = require("../config");
const packageConfig = require("../package.json");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const hash = require("hash-sum");

exports.assetsPath = function (_path) {
  const assetsSubDirectory =
    process.env.NODE_ENV === "production" ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
};

exports.cssLoaders = function (options) {
  options = options || {};

  const cssLoader = {
    loader: "css-loader",
    options: {
      importLoaders: 2,
      sourceMap: options.sourceMap
    }
  };

  const postcssLoader = {
    loader: "postcss-loader",
    options: {
      sourceMap: options.sourceMap
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) {
      loaders.push({
        loader: loader + "-loader",
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      // return ExtractTextPlugin.extract({
      //   use: loaders,
      //   fallback: "vue-style-loader"
      // });

      // vue-style-loader 无法与 MiniCssExtractPlugin.loader 共用，会报错
      return [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: "../"
          }
        },
        ...loaders
      ];
    } else {
      return ["vue-style-loader"].concat(loaders);
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders("less"),
    sass: generateLoaders("sass", {
      indentedSyntax: true
    }),
    scss: generateLoaders("sass"),
    stylus: generateLoaders("stylus"),
    styl: generateLoaders("stylus")
  };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = [];
  const loaders = exports.cssLoaders(options);

  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp("\\." + extension + "$"),
      use: loader
    });
  }

  return output;
};

exports.createNotifierCallback = () => {
  const notifier = require("node-notifier");

  return (severity, errors) => {
    if (severity.trim() !== "error") return;

    const error = errors[0];
    const filename = error.file && error.file.split("!").pop();

    notifier.notify({
      title: packageConfig.name,
      message: severity + ": " + error.name,
      subtitle: filename || "",
      icon: exports.resolve("logo.png")
    });
  };
};

exports.cacheConfig = (name, variables) => {
  if (!variables) {
    variables = {
      "cache-loader": require('cache-loader/package.json').version,
      "env": process.env.NODE_ENV,
      "modern": !!process.env.MODERN_BUILD
    }
  }
  return {
    cacheDirectory: exports.resolve("node_modules\\.cache\\" + name + "-loader"),
    cacheIdentifier: hash(variables)
  };
}

exports.resolve = function (dir) {
  return path.join(__dirname, "..", dir);
}

exports.isObject = function (arg) {
  return Object.prototype.toString.call(arg) === "[object Object]"
}
