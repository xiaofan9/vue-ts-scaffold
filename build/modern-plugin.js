const fs = require('fs-extra')
const path = require('path')

// https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc
const safariFix = `!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();`

class ModernModePlugin {
  constructor({
    targetDir,
    only = false
  }) {
    this.targetDir = targetDir;
    this.only = only;
  }
  apply(compiler) {
    let isModernBuild = !!process.env.MODERN_BUILD;
    if (!isModernBuild) {
      this.applyLegacy(compiler)
    } else {
      this.applyModern(compiler)
    }
  }

  applyLegacy(compiler) {
    const ID = "legacy-bundle"
    compiler.hooks.compilation.tap(ID, compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(ID, async (data, cb) => {
        // get stats, write to disk
        await fs.ensureDir(this.targetDir)
        const htmlName = path.basename(data.plugin.options.filename)
        // Watch out for output files in sub directories
        const htmlPath = path.dirname(data.plugin.options.filename)
        const tempFilename = path.join(this.targetDir, htmlPath, `legacy-assets-${htmlName}.json`)
        await fs.mkdirp(path.dirname(tempFilename))
        await fs.writeFile(tempFilename, JSON.stringify(data.body))
        cb()
      })
    })
  }

  applyModern(compiler) {
    const ID = "modern-bundle"
    compiler.hooks.compilation.tap(ID, compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(ID, async (data, cb) => {
        // use <script type="module"> for modern assets
        data.body.forEach(tag => {
          if (tag.tagName === 'script' && tag.attributes) {
            tag.attributes.type = 'module'
          }
        })

        // use <link rel="modulepreload"> instead of <link rel="preload">
        // for modern assets
        data.head.forEach(tag => {
          if (tag.tagName === 'link' &&
            tag.attributes.rel === 'preload' &&
            tag.attributes.as === 'script') {
            tag.attributes.rel = 'modulepreload'
          }
        })

        // inject Safari 10 nomodule fix
        data.body.push({
          tagName: 'script',
          closeTag: true,
          innerHTML: safariFix
        })

        if (!this.only) {
          // inject links for legacy assets as <script nomodule>
          const htmlName = path.basename(data.plugin.options.filename)
          // Watch out for output files in sub directories
          const htmlPath = path.dirname(data.plugin.options.filename)
          const tempFilename = path.join(this.targetDir, htmlPath, `legacy-assets-${htmlName}.json`)
          const legacyAssets = JSON.parse(await fs.readFile(tempFilename, 'utf-8'))
            .filter(a => a.tagName === 'script' && a.attributes)
          legacyAssets.forEach(a => {
            a.attributes.nomodule = ''
          })
          data.body.push(...legacyAssets)
          await fs.remove(tempFilename)
        }
        cb()
      })

      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(ID, data => {
        data.html = data.html.replace(/\snomodule="">/g, ' nomodule>')
        // 兼容方案，preload-webpack-plugin 在 htmlWebpackPluginAlterAssetTags 钩子函数种拿不到preload 的属性
        // data.html = data.html.replace(/(.*?<link.*?as=script.*?)(rel=preload)/gi, "$1rel=modulepreload")
      })
    })
  }
}

module.exports = ModernModePlugin
