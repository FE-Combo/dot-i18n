const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const config = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "static/js/[name].js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    modules: ["./src", "node_modules"]
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /(\.tsx|\.ts)$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          getCustomTransformers: () => ({
            before: [ReactRefreshTypeScript()],
          }),
          transpileOnly: true,
        },
      },
      {
        test: /\.(tsx|ts|js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: 'dot-i18n-loader' },
    }
    ]
  },
  plugins: [
    new HTMLPlugin({
      template: `./src/index.html`
    }),
    new ReactRefreshWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
  ]
};

module.exports = config;
