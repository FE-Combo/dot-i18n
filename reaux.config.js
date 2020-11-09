const path = require("path");

  module.exports = {
    baseConfig:function (config) {
        config.entry = path.resolve(__dirname,"./demo/App.tsx")
        config.htmlTemplate = path.resolve(__dirname,"./demo/index.html")
        return config;
      },
    webpackDevConfig:function (config){
        config.module.rules.push({
            test: /\.(tsx|ts|js|jsx)$/,
            exclude: /node_modules/,
            use: { loader: './build/i18n-loader' },
        });
        return config
      },
  }