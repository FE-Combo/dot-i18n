import {register} from "ts-node";
import path from "path";
import fs from "fs-extra";
import * as i18nStore from "./store";

function execute() {
    const configJsonPath = process.cwd() + "/i18n.config.json";
    let config = {...i18nStore.getConfig() }
    if(fs.pathExistsSync(configJsonPath)){
        config = {...config, ...JSON.parse(fs.readFileSync(configJsonPath).toString())};
        i18nStore.setConfig(config);
    }

    const configFilePath = path.resolve(__dirname, config.isDev ? "../config/node.tsconfig.json" : "./config/node.tsconfig.json");
    register({project: configFilePath});
    try {
        const outDir = process.cwd() + config.outDir + "/index.ts";
        if (fs.pathExistsSync(outDir)) {
            const allLocales:i18nStore.Locales = require(process.cwd() + config.outDir + "/index.ts")?.default || {};
            i18nStore.setLocales(allLocales);

            const mainLanguage = config?.languages?.[0] || "zh";
            const mainLanguageLocalePath = `${process.cwd()}${config.outDir}/${mainLanguage}.ts`;
            if (fs.pathExistsSync(mainLanguageLocalePath)) {
                const mainLanguageLocale = require(mainLanguageLocalePath)?.default || {};
                i18nStore.setReserveLocale(mainLanguageLocale)
            }
        }
    } catch (error) {
        console.info(error);
    }
}

if (!i18nStore.getIfInitial()) {
    i18nStore.setIfInitial(true)
    execute();
}
