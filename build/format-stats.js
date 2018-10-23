const path = require("path");
const utils = require("./utils");
const fs = require("fs");
const zlib = require("zlib");
const chalk = require("chalk");
const cliui = require("cliui");

module.exports = (stats, dir = "dist") => {
  const ui = cliui({
    width: 120
  });
  const seenNames = new Map();
  const isJS = val => /\.js$/.test(val);
  const isCSS = val => /\.css$/.test(val);

  const json = stats.toJson({
    hash: false,
    modules: false,
    chunks: false
  });

  let assets = json.assets ?
    json.assets :
    json.children.reduce((acc, child) => acc.concat(child.assets), []);

  assets = assets.filter(a => {
    if (seenNames.has(a.name)) {
      return false;
    }
    seenNames.set(a.name, true);
    return isJS(a.name) || isCSS(a.name);
  }).sort((a, b) => {
    return a["chunks"] - b["chunks"]
  })

  function makeRow(a, b, c, d) {
    return `  ${a}\t        ${b}\t${c}\t${d}`;
  }

  // require("fs-extra").outputJSONSync(utils.resolve("test.json"), assets);

  ui.div(
    makeRow(
      chalk.cyan.bold(`File`),
      chalk.cyan.bold(`Chunk`),
      chalk.cyan.bold(`Size`),
      chalk.cyan.bold(`Gzipped`),
    ) +
    `\n\n` +
    assets
    .map(asset =>
      makeRow(
        /js$/.test(asset.name) ?
        chalk.green(path.join(dir, asset.name)) :
        chalk.blue(path.join(dir, asset.name)),
        chalk.magenta(asset.chunkNames),
        formatSize(asset.size),
        getGzippedSize(asset, dir),
      )
    )
    .join(`\n`));


  return `${ui.toString()}\n\n  ${chalk.gray(
    `Images and other types of assets omitted.`
  )}\n`;
}

function getGzippedSize(asset, dir) {
  const filepath = utils.resolve(path.join(dir, asset.name));
  const buffer = fs.readFileSync(filepath);
  return formatSize(zlib.gzipSync(buffer).length);
}

function formatSize(size) {
  return (size / 1024).toFixed(2) + " kb";
}
