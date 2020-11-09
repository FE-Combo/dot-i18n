import {register} from "ts-node";
import path from "path";
import fs from "fs-extra";
import * as i18nStore from "./i18n-store";

const defaultConfig = {
    localePath: "/src/locales",
    languages: ["zh", "en"],
    template: "i18n",
    exportExcelPath: "/.i18n/result.xlsx",
    importExcelPath: "/.i18n/result.xlsx",
    strict: true,
};

function execute() {
    const config: i18nStore.Config = {...defaultConfig, ...JSON.parse(fs.readFileSync(process.cwd() + "/i18n.json").toString())};
    const configFilePath = path.resolve(__dirname, config.isDev ? "../config/node.tsconfig.json" : "./config/node.tsconfig.json");
    register({project: configFilePath});
    try {
        i18nStore.setConfig(config);
        const localePath = process.cwd() + config.localePath + "/index.ts";

        if (fs.pathExistsSync(localePath)) {
            const allLocales = require(process.cwd() + config.localePath + "/index.ts").default;
            i18nStore.setLocales(allLocales);
        } else {
            const locales = {};
            config.languages.forEach((_) => {
                locales[_] = {};
            });
            i18nStore.setLocales(locales);
        }

        const reverseLocale = {};
        const mainLanguage = config.languages[0];
        const mainLanguageLocalePath = `${process.cwd()}${config.localePath}/${mainLanguage}.ts`;
        if (fs.pathExistsSync(localePath) && fs.pathExistsSync(mainLanguageLocalePath)) {
            const accordingCodeLocale = require(mainLanguageLocalePath).default;
            Object.keys(accordingCodeLocale).forEach((_) => {
                const subLocale = accordingCodeLocale[_];
                Object.keys(subLocale).forEach((__) => {
                    if (!reverseLocale[_]) {
                        reverseLocale[_] = {};
                    }
                    reverseLocale[_][subLocale[__]] = __;
                });
            });
            i18nStore.setReverseLocale(reverseLocale);
        }
    } catch (error) {
        console.info(error);
    }
}

if (!i18nStore.getConfig()) {
    execute();
}
