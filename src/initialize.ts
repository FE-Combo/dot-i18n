import {register} from "ts-node";
import path from "path";
import fs from "fs-extra";
import * as i18nStore from "./i18n-store";

function execute() {
    const configJsonPath = process.cwd() + "/i18n.json";
    let config = {...i18nStore.getConfig() }
    if(fs.pathExistsSync(configJsonPath)){
        config = {...config, ...JSON.parse(fs.readFileSync(configJsonPath).toString())};
        i18nStore.setConfig(config);
    }

    const configFilePath = path.resolve(__dirname, config.isDev ? "../config/node.tsconfig.json" : "./config/node.tsconfig.json");
    register({project: configFilePath});
    try {
        const localePath = process.cwd() + config.localePath + "/index.ts";
        if (fs.pathExistsSync(localePath)) {
            const allLocales:i18nStore.Locales  = require(process.cwd() + config.localePath + "/index.ts")?.default || {};
            i18nStore.setLocales(allLocales);

            const mainLanguage = config?.languages?.[0] || "zh";
            const mainLanguageLocalePath = `${process.cwd()}${config.localePath}/${mainLanguage}.ts`;
            if (fs.pathExistsSync(mainLanguageLocalePath)) {
                const mainLanguageLocale = require(mainLanguageLocalePath)?.default || {};
                const reverseLocale = Object.keys(mainLanguageLocale).reduce((preObject,namespace)=>{
                    preObject[namespace] = Object.keys(mainLanguageLocale[namespace]).reduce((preSubObject,code)=>{
                        const value = preSubObject[code];
                        preSubObject[value] = code;
                        delete preSubObject[code];
                        return preSubObject;
                    },{...mainLanguageLocale[namespace]});
                    return preObject
                },{})
                i18nStore.setReverseLocale(reverseLocale);
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
