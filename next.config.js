const path = require("path")
const withOffline = require("next-offline")
const compose = require("ramda/src/compose")
const forEach = require("ramda/src/forEach")
const reduce = require("ramda/src/reduce")
const concat = require("ramda/src/concat")
const filter = require("ramda/src/filter")
const values = require("ramda/src/values")
const pluck = require("ramda/src/pluck")
const isNil = require("ramda/src/isNil")
const complement = require("ramda/src/complement")

const cids = require("./dfx.webpack.config").initCanisterIds

const webpack = require("webpack")

// Make DFX_NETWORK available to Web Browser with default "local" if DFX_NETWORK is undefined
const EnvPlugin = new webpack.EnvironmentPlugin({
  DFX_NETWORK: "local",
})

const nextConfig = {
  target: "serverless",
  transformManifest: manifest => ["/"].concat(manifest),
  generateInDevMode: true,
  generateSw: false,
  workboxOpts: {
    swDest: "static/service-worker.js",
    swSrc: __dirname + "/nd/sw.js",
  },
  publicRuntimeConfig: {
    ...cids(),
    NEXT_PUBLIC_IC_HOST: process.env.NEXT_PUBLIC_IC_HOST,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    compose(
      forEach(
        v =>
          (config.resolve.alias[v] = path.resolve(
            __dirname,
            `node_modules/${v}`
          ))
      ),
      reduce(concat, ["recoil", "ramda"]),
      filter(complement(isNil)),
      pluck("peer"),
      values
    )(require("./nd/.plugins"))
    // Plugin
    config.plugins.push(EnvPlugin)
    // Important: return the modified config
    return config
  },
}
module.exports = withOffline(nextConfig)
