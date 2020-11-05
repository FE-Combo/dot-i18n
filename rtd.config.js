const path = require("path");

  module.exports = {
    baseConfig:function (config) {
        config.entry = path.resolve(__dirname,"./src/App.tsx")
        return config;
      },
    webpackDevConfig:function (config){
        config.module.rules.push({
            test: /\.(tsx|ts|js|jsx)$/,
            exclude: /node_modules/,
            use: { loader: './node/i18n-loader' },
        });
        return config
      },
  }