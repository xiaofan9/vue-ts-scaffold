const isProd = process.env.NODE_ENV === "production";
const isTesting = process.env.NODE_ENV === "testing";
const isDev = process.env.NODE_ENV === "development";
const isModernBuild = process.env.MODERN_BUILD === "modern";
const comments = false;

const presets = [
  [
    "@babel/preset-env",
    {
      modules: isTesting ? "commonjs" : false,
      useBuiltIns: isProd || isModernBuild ? "usage" : false,
      ...(isDev ? {
        targets: {
          browsers: ["Chrome >= 50"]
        }
      }
        : isModernBuild ? {
          targets: {
            esmodules: true
          }
        } : {})
    }
  ]
];

const plugins = [
  "babel-plugin-transform-vue-jsx",
  ...(isProd || isModernBuild ? [] : ["@babel/plugin-transform-runtime"])
];

module.exports = {
  presets,
  plugins,
  comments
};
