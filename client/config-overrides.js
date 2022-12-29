const { removeModuleScopePlugin, override, babelInclude, addWebpackPlugin } = require("customize-cra")
const { ProvidePlugin } = require("webpack")
const path = require("path")

module.exports = function override(config, env) {
  config = removeModuleScopePlugin()(config, env)

  config = babelInclude([path.resolve("src"), path.resolve("../backend/types")])(config, env)

  config.resolve.fallback = {
    url: require.resolve("url"),
    assert: require.resolve("assert"),
    buffer: require.resolve("buffer"),
  }
  config.plugins.push(
    new ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  )

  return config
}
