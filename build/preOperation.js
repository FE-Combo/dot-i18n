"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts_node_1 = require("ts-node");
var path_1 = tslib_1.__importDefault(require("path"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var i18nStore = tslib_1.__importStar(require("./i18n-store"));
var defaultConfig = {
    localePath: "/src/locales",
    languages: ["zh", "en"],
    template: "i18n",
    exportExcelPath: "/.i18n/result.xlsx",
    importExcelPath: "/.i18n/result.xlsx",
    strict: true,
};
function execute() {
    var configFilePath = path_1.default.resolve(__dirname, "../config/node.tsconfig.json");
    ts_node_1.register({ project: configFilePath });
    try {
        var config = tslib_1.__assign(tslib_1.__assign({}, defaultConfig), JSON.parse(fs_extra_1.default.readFileSync(process.cwd() + "/i18n.json").toString()));
        i18nStore.setConfig(config);
        var localePath = process.cwd() + config.localePath + "/index.ts";
        if (fs_extra_1.default.pathExistsSync(localePath)) {
            var allLocales = require(process.cwd() + config.localePath + "/index.ts").default;
            i18nStore.setLocales(allLocales);
        }
        else {
            var locales_1 = {};
            config.languages.forEach(function (_) {
                locales_1[_] = {};
            });
            i18nStore.setLocales(locales_1);
        }
        var reverseLocale_1 = {};
        var mainLanguage = config.languages[0];
        var mainLanguageLocalePath = "" + process.cwd() + config.localePath + "/" + mainLanguage + ".ts";
        if (fs_extra_1.default.pathExistsSync(localePath) && fs_extra_1.default.pathExistsSync(mainLanguageLocalePath)) {
            var accordingCodeLocale_1 = require(mainLanguageLocalePath).default;
            Object.keys(accordingCodeLocale_1).forEach(function (_) {
                var subLocale = accordingCodeLocale_1[_];
                Object.keys(subLocale).forEach(function (__) {
                    if (!reverseLocale_1[_]) {
                        reverseLocale_1[_] = {};
                    }
                    reverseLocale_1[_][subLocale[__]] = __;
                });
            });
            i18nStore.setReverseLocale(reverseLocale_1);
        }
    }
    catch (error) {
        console.info(error);
    }
}
if (!i18nStore.getConfig()) {
    execute();
}
