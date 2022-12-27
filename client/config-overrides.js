const { removeModuleScopePlugin, override, babelInclude, getBabelLoader } = require("customize-cra")
const path = require("path")

module.exports = override(
  removeModuleScopePlugin(), // (1)
  babelInclude([
    path.resolve("src"),
    path.resolve("../backend/types"), // (2)
  ]),
)
