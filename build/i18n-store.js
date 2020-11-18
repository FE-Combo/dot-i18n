"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocaleProvider = exports.t = exports.getReverseLocale = exports.setReserveLocale = exports.getLocales = exports.setLocales = exports.getConfig = exports.setConfig = exports.useLocales = exports.getLanguage = exports.setLanguage = exports.getIfInitial = exports.setIfInitial = exports.defaultConfig = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
exports.defaultConfig = {
    baseUrl: "/src",
    outDir: "/src/locales",
    languages: ["zh", "en"],
    exportExcelPath: "/.i18n/result.xlsx",
    importExcelPath: "/.i18n/result.xlsx",
    strict: true,
};
var I18nContext = react_1.default.createContext({});
var cache = {
    isInit: false,
    language: "zh",
    config: exports.defaultConfig,
    locales: {},
    reverseLocale: {},
};
function setIfInitial(isInit) {
    cache.isInit = isInit;
}
exports.setIfInitial = setIfInitial;
function getIfInitial() {
    return cache.isInit;
}
exports.getIfInitial = getIfInitial;
function setLanguage(language) {
    cache.language = language;
}
exports.setLanguage = setLanguage;
function getLanguage() {
    return cache.language;
}
exports.getLanguage = getLanguage;
function useLocales() {
    return react_1.default.useContext(I18nContext);
}
exports.useLocales = useLocales;
function setConfig(config) {
    cache.config = config;
}
exports.setConfig = setConfig;
function getConfig() {
    return cache.config;
}
exports.getConfig = getConfig;
function setLocales(locales) {
    cache.locales = locales;
}
exports.setLocales = setLocales;
function getLocales() {
    return cache.locales;
}
exports.getLocales = getLocales;
function setReserveLocale(locales) {
    cache.reverseLocale = Object.keys(locales).reduce(function (preObject, namespace) {
        preObject[namespace] = Object.keys(locales[namespace]).reduce(function (preSubObject, code) {
            var value = preSubObject[code];
            preSubObject[value] = code;
            delete preSubObject[code];
            return preSubObject;
        }, tslib_1.__assign({}, locales[namespace]));
        return preObject;
    }, {});
}
exports.setReserveLocale = setReserveLocale;
function getReverseLocale() {
    return cache.reverseLocale;
}
exports.getReverseLocale = getReverseLocale;
function t(value, options, currentLocale) {
    var _a, _b;
    var result = value;
    var nextLocale = currentLocale || ((_a = cache === null || cache === void 0 ? void 0 : cache.locales) === null || _a === void 0 ? void 0 : _a[cache.language]) || {};
    if (nextLocale) {
        var reverseLocale = cache.reverseLocale;
        var namespace = (typeof options === "string" ? options : options === null || options === void 0 ? void 0 : options.namespace) || "global";
        var replaceVariable_1 = options === null || options === void 0 ? void 0 : options.replace;
        if (((_b = reverseLocale === null || reverseLocale === void 0 ? void 0 : reverseLocale[namespace]) === null || _b === void 0 ? void 0 : _b[value]) && (nextLocale === null || nextLocale === void 0 ? void 0 : nextLocale[namespace])) {
            var code = reverseLocale[namespace][value];
            if (nextLocale[namespace][code]) {
                result = nextLocale[namespace][code];
            }
        }
        if (replaceVariable_1) {
            Object.keys(replaceVariable_1).forEach(function (key) {
                result = result.replace(new RegExp(key, "g"), replaceVariable_1[key]);
            });
        }
    }
    return result;
}
exports.t = t;
function LocaleProvider(props) {
    var _a, _b, _c;
    var children = props.children, locales = props.locales, language = props.language;
    if (Object.keys(cache.locales).length <= 0) {
        setLocales(locales);
        // TODO: Object cannot guarantee order
        setReserveLocale((locales === null || locales === void 0 ? void 0 : locales[(_b = (_a = Object.keys(locales)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "zh"]) || {});
        setLanguage(language + "");
    }
    return (react_1.default.createElement(I18nContext.Provider, { value: (_c = locales === null || locales === void 0 ? void 0 : locales[language]) !== null && _c !== void 0 ? _c : {} }, children));
}
exports.LocaleProvider = LocaleProvider;
