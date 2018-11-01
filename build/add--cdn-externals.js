const config = require("../config");

let cdn = config.cdn || [];
const externals = handlerExternals(config.externals);

function handlerExternals(externals) {
  if (!externals || !(isObject(externals) && Object.keys(externals).length)) {
    return {};
  }

  let obj = {};

  Object.keys(externals).forEach(k => {
    let tmp = externals[k];
    if (isObject(tmp)) {
      if (tmp["window"]) {
        obj[k] = tmp["window"];
      }

      if (tmp["cdn"] && typeof tmp["cdn"] === "string") {
        cdn.unshift(tmp["cdn"]);
      }
    } else {
      obj[k] = tmp;
    }
  });

  return obj;
}

function isObject(arg) {
  return Object.prototype.toString.call(arg) === "[object Object]";
}

module.exports = {
  cdn,
  externals
};
