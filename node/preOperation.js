const tsNode = require("ts-node");
const path = require("path");
const fs = require("fs-extra");
const i18nStore = require("./i18n-store");

const defaultConfig = {
    localePath: "/src/locales",
    languages: ["zh", "en"],
};

function execute() {
    const configFilePath = path.resolve(__dirname, "../config/node.tsconfig.json");
    tsNode.register({project: configFilePath});

    try {
        const config = {...defaultConfig, ...JSON.parse(fs.readFileSync(process.cwd() + "/i18n.json"))};
        i18nStore.setConfig(config);

        const allLocales = require(process.cwd() + config.localePath + "/index.ts").default;
        i18nStore.setLocales(allLocales);

        const reverseLocale = {};
        const mainLanguage = config.languages[0];
        const accordingCodeLocale = require(path.resolve(__dirname, "../src/locales/" + mainLanguage + "/index.ts")).default;
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
    } catch (error) {
        console.info(error);
    }
}

if (!i18nStore.getConfig()) {
    execute();
}
