/**
 * 首个版本
 *    支持添加js/css, 可自定义 一些参数
 */
class CDNPlugin {
  constructor(opt = {}) {
    let {
      chunk, // 为true 默认as/rel/type不生效
      cdn = [],
      as = "js",
      rel = "",
      only = [],
      type = as === "css" ? "text/css" : as === "js" ? "text/javascript" : "",
      attr = {}
    } = opt;

    this.prefix = "";

    this.opt = opt;
    this.as = attr.as || as;
    this.rel = this.as === "css" ? "stylesheet" : (attr.rel || rel); // 仅当as不等于js/css 时, rel有效
    this.type = attr.type || type;

    this.cdns = cdn;
    this.only = only;
    this.attr = attr;
    this.chunk = chunk;
  }

  apply(compiler) {
    const ID = "cdn-plugin";

    compiler.hooks.compilation.tap(ID, compilation => {
      // compilation.assets -> 所有的资源
      // compilation.chunks -> 所有的模块
      // chunk.isInitial() 或 chunk.canBeInitial() 检测该chuk是否是入口文件
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(ID, async (data, cb) => {
        let tmp = data.outputName.split(".");

        if (tmp[tmp.length - 1].includes("html")) {
          tmp.pop();
        }

        let outputName = tmp.join(".");
        if (this.only.length && !this.only.includes(outputName)) {
          cb();

          return;
        }

        if (this.chunk) {
          let chunks = data.chunks;
          let cdns = [];

          for (let chunk of chunks) {
            cdns = [...new Set([...cdns, ...chunk.files])]
          }

          let cdn_js = cdns.filter(cdn => {
            let tmp = cdn.split(".");
            if (tmp[tmp.length - 1] === "js") {
              return true;
            }

            return false;
          });

          let cdn_css = cdns.filter(cdn => {
            let tmp = cdn.split(".");
            if (tmp[tmp.length - 1] === "css") {
              return true;
            }

            return false;
          });

          this.addCDN(data);

          let isAs = this.isOptExist("as");
          let isRel = this.isOptExist("rel");
          let isType = this.isOptExist("type");

          this.addCDN(data, cdn_css, {
            as: isAs ? this.as : "style",
            rel: isRel ? this.rel : "preload",
            type: isType ? this.type : "text/css"
          });

          this.addCDN(data, cdn_js, {
            as: isAs ? this.as : "script",
            rel: isRel ? this.rel : "modulepreload",
            type: isType ? this.type : "text/javascript"
          });

          cb();
          return;
        }

        this.addCDN(data);
        cb()
      })
    })
  }

  addCDN(data, cdns = this.cdns, attr = {}) {
    let type = attr.type || this.type;
    let as = attr.as || this.as;
    let rel = attr.rel || this.rel;
    let prefix = attr.prefix || this.prefix;

    for (let cdn of cdns) {
      if (!cdn) {
        continue;
      }

      let attributes = {};

      if (type) {
        attributes = {
          type
        };
      }

      if (as !== "js") {
        attributes = {
          ...attributes,
          href: prefix + cdn,
          rel
        }
      } else {
        // js -> script标签
        attributes = {
          ...attributes,
          src: prefix + cdn
        }
      }

      if (as !== "js" && as !== "css" && as) {
        attributes.as = as;
      }

      attributes = {
        ...attributes,
        ...this.attr,
      }

      data.head.push({
        tagName: as === "js" ? "script" : 'link',
        closeTag: true,
        attributes
      })
    }
  }

  isOptExist(name) {
    return this.opt[name] || (this.opt.attr || {})[name];
  }
}

module.exports = CDNPlugin;
