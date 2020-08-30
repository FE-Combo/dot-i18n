const tsNode = require("ts-node");
const path = require("path");
const shelljs = require("shelljs");
const i18nStore = require("./i18n-store");

function execute() {
    const configFilePath = path.resolve(__dirname, "../config/node.tsconfig.json");
    tsNode.register({project: configFilePath});
    const allLocales = require("../src/locales/index.ts");
    i18nStore.setLocales(allLocales);
    i18nStore.setReverseLocale(require(path.resolve(__dirname, "../src/locales/zh/index.ts")));
    try {
        shelljs.ls(path.resolve(__dirname, "../src/locales/zh")).forEach((file) => {
            const f = path.resolve(__dirname, "../src/locales/zh/" + file);
        });
    } catch (event) {
        console.info(event);
    }
}

execute();
