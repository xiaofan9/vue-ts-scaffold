const opn = require("opn");

class OpenBrowser {
  constructor(open, host, port, pathName) {
    this.host = host || "localhost";
    this.port = port || "8080";
    this.open = open || false;
    this.pathName = pathName || "";
  }
  apply(compiler) {
    compiler.hooks.done.tap("open-browser-plugin", () => {
      if (this.open) {
        const url =
          "http://" +
          this.host +
          ":" +
          this.port +
          getPathName(this.pathName);

        opn(url).catch(err => console.error(err));
      }
    });
  }
}

module.exports = OpenBrowser;

function getPathName(pathName = "") {
  if (pathName.indexOf("/") === 0) {
    return pathName;
  }

  if (pathName === "") {
    return "";
  }

  return "/" + pathName;
}
