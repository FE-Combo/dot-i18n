"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = exports.getReverseLocale = exports.setReverseLocale = exports.getLocales = exports.setLocales = exports.getConfig = exports.setConfig = exports.getContext = exports.createContext = exports.useLocales = exports.getIfInitial = exports.setIfInitial = exports.defaultConfig = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
exports.defaultConfig = {
    source: "/src",
    localePath: "/src/locales",
    languages: ["zh", "en"],
    template: "i18n",
    exportExcelPath: "/.i18n/result.xlsx",
    importExcelPath: "/.i18n/result.xlsx",
    strict: true,
};
var cache = {
    isInit: false,
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
function useLocales() {
    return react_1.default.useContext(cache === null || cache === void 0 ? void 0 : cache.context);
}
exports.useLocales = useLocales;
function createContext() {
    cache.context = react_1.default.createContext({});
}
exports.createContext = createContext;
function getContext() {
    return cache.context;
}
exports.getContext = getContext;
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
function setReverseLocale(reverseLocale) {
    cache.reverseLocale = reverseLocale;
}
exports.setReverseLocale = setReverseLocale;
function getReverseLocale() {
    return cache.reverseLocale;
}
exports.getReverseLocale = getReverseLocale;
function t(value, options, currentLocale, reverseLocaleString) {
    var result = value;
    var namespace = (typeof options === "string" ? options : options === null || options === void 0 ? void 0 : options.namespace) || "global";
    var replaceVariable = options === null || options === void 0 ? void 0 : options.replace;
    var reverseLocale = JSON.parse(reverseLocaleString);
    if (reverseLocale && reverseLocale[namespace] && reverseLocale[namespace][value] && currentLocale && currentLocale[namespace]) {
        var code = reverseLocale[namespace][value];
        if (currentLocale[namespace][code]) {
            result = currentLocale[namespace][code];
        }
    }
    if (replaceVariable) {
        Object.keys(replaceVariable).forEach(function (key) {
            result = result.replace(new RegExp(key, "g"), replaceVariable[key]);
        });
    }
    return result;
}
exports.t = t;
