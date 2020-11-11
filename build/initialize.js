"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts_node_1 = require("ts-node");
var path_1 = tslib_1.__importDefault(require("path"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var i18nStore = tslib_1.__importStar(require("./i18n-store"));
function execute() {
    var _a, _b, _c;
    var configJsonPath = process.cwd() + "/i18n.json";
    var config = tslib_1.__assign({}, i18nStore.getConfig());
    if (fs_extra_1.default.pathExistsSync(configJsonPath)) {
        config = tslib_1.__assign(tslib_1.__assign({}, config), JSON.parse(fs_extra_1.default.readFileSync(configJsonPath).toString()));
        i18nStore.setConfig(config);
    }
    var configFilePath = path_1.default.resolve(__dirname, config.isDev ? "../config/node.tsconfig.json" : "./config/node.tsconfig.json");
    ts_node_1.register({ project: configFilePath });
    try {
        var localePath = process.cwd() + config.localePath + "/index.ts";
        if (fs_extra_1.default.pathExistsSync(localePath)) {
            var allLocales = ((_a = require(process.cwd() + config.localePath + "/index.ts")) === null || _a === void 0 ? void 0 : _a.default) || {};
            i18nStore.setLocales(allLocales);
            var mainLanguage = ((_b = config === null || config === void 0 ? void 0 : config.languages) === null || _b === void 0 ? void 0 : _b[0]) || "zh";
            var mainLanguageLocalePath = "" + process.cwd() + config.localePath + "/" + mainLanguage + ".ts";
            if (fs_extra_1.default.pathExistsSync(mainLanguageLocalePath)) {
                var mainLanguageLocale_1 = ((_c = require(mainLanguageLocalePath)) === null || _c === void 0 ? void 0 : _c.default) || {};
                var reverseLocale = Object.keys(mainLanguageLocale_1).reduce(function (preObject, namespace) {
                    preObject[namespace] = Object.keys(mainLanguageLocale_1[namespace]).reduce(function (preSubObject, code) {
                        var value = preSubObject[code];
                        preSubObject[value] = code;
                        delete preSubObject[code];
                        return preSubObject;
                    }, tslib_1.__assign({}, mainLanguageLocale_1[namespace]));
                    return preObject;
                }, {});
                i18nStore.setReverseLocale(reverseLocale);
            }
        }
    }
    catch (error) {
        console.info(error);
    }
}
if (!i18nStore.getIfInitial()) {
    i18nStore.setIfInitial(true);
    execute();
}
