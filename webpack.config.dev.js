const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
const I18nPlugin = require("./i18n-plugin");

const config = {
    mode: "development",
    entry: ["webpack-dev-server/client?https://0.0.0.0:8080", "webpack/hot/dev-server", `./src/App.tsx`],
    output: {
        filename: "static/js/[name].js",
        publicPath: "/",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".less"],
        modules: ["./src", "node_modules"],
    },
    devtool: "cheap-module-source-map",
    module: {
        rules: [
            {
                test: /(\.tsx|\.ts)$/,
                exclude: /node_modules/,
                use: ["ts-loader", "./i18n-loader"],
            },
        ],
    },
    plugins: [
        new HTMLPlugin({
            template: `./src/index.html`,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin(),
        new I18nPlugin({
            param: "param",
        }),
    ],
};

module.exports = config;
