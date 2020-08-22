const webpack = require("webpack");
const path = require("path");
const ForkTSCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

function resolve(relativePath) {
    return path.resolve(__dirname, `./${relativePath}`);
}

const webpackConfig = [
    {
        mode: "production",
        entry: {
            index: `${resolve("src")}/index.tsx`,
            "index.min": `${resolve("src")}/index.tsx`,
        },
        output: {
            path: resolve("dist"),
            filename: "[name].js",
            library: "SUPER_EDITOR",
            libraryTarget: "umd",
            libraryExport: "default",
            globalObject: "this",
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".less"],
            modules: [resolve("src"), "node_modules"],
        },
        optimization: {
            minimizer: [new TerserPlugin({include: /index\.min\.js$/})],
        },
        performance: {
            maxEntrypointSize: 720000,
            maxAssetSize: 1000000,
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: "ts-loader",
                    include: [resolve("src")],
                },
            ],
        },
        plugins: [
            new ForkTSCheckerPlugin({
                tsconfig: resolve("tsconfig.json"),
                tslint: resolve("tslint.json"),
                useTypescriptIncrementalApi: false,
                workers: ForkTSCheckerPlugin.TWO_CPUS_FREE,
            }),
            new webpack.ProgressPlugin(),
        ],
    },
];

module.exports = webpackConfig;
