const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const { pickBy, propEq, compose, keys } = require("ramda")
const ic = require(path.resolve(__dirname, "dfx.json")).canisters
const id = compose(keys, pickBy(propEq("type", "motoko")))(ic)[0]
const asset_id = compose(keys, pickBy(propEq("type", "assets")))(ic)[0]
let localCanisters, prodCanisters, canisters

function initCanisterIds() {
  try {
    localCanisters = require(path.resolve(".dfx", "local", "canister_ids.json"))
  } catch (error) {
    console.log("No local canister_ids.json found. Continuing production")
  }
  try {
    prodCanisters = require(path.resolve("canister_ids.json"))
  } catch (error) {
    console.log("No production canister_ids.json found. Continuing with local")
  }

  const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === "production" ? "ic" : "local")

  canisters = network === "local" ? localCanisters : prodCanisters
  let env = {}
  for (const canister in canisters) {
    process.env[canister.toUpperCase() + "_CANISTER_ID"] =
      canisters[canister][network]
    env[canister.toUpperCase() + "_CANISTER_ID"] = canisters[canister][network]
  }
  return env
}
initCanisterIds()

const isDevelopment = process.env.NODE_ENV !== "production"
const asset_entry = path.join("src", asset_id, "src", "index.html")

module.exports = {
  initCanisterIds,
  target: "web",
  mode: isDevelopment ? "development" : "production",
  entry: {
    // The frontend.entrypoint points to the HTML file for this build, so we need
    // to replace the extension to `.js`.
    index: path.join(__dirname, asset_entry).replace(/\.html$/, ".js"),
  },
  devtool: isDevelopment ? "source-map" : false,
  optimization: {
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      stream: require.resolve("stream-browserify/"),
      util: require.resolve("util/"),
    },
  },
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist", asset_id),
  },

  // Depending in the language or framework you are using for
  // front-end development, add module loaders to the default
  // webpack configuration. For example, if you are using React
  // modules and CSS as described in the "Adding a stylesheet"
  // tutorial, uncomment the following lines:
  // module: {
  //  rules: [
  //    { test: /\.(ts|tsx|jsx)$/, loader: "ts-loader" },
  //    { test: /\.css$/, use: ['style-loader','css-loader'] }
  //  ]
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, asset_entry),
      cache: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "src", asset_id, "assets"),
          to: path.join(__dirname, "dist", asset_id),
        },
      ],
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
      [`${id.toUpperCase()}_CANISTER_ID`]: canisters[id],
    }),
    new webpack.ProvidePlugin({
      Buffer: [require.resolve("buffer/"), "Buffer"],
      process: require.resolve("process/browser"),
    }),
  ],
  // proxy /api to port 8000 during development
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
    hot: true,
    contentBase: path.resolve(__dirname, `./src/${asset_id}`),
    watchContentBase: true,
  },
}
