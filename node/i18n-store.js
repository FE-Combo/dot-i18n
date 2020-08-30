const {createContext} = require("react");

const cache = {};

module.exports = {
    createContext() {
        cache.context = createContext({});
    },
    getContext() {
        return cache.context;
    },
    get Context() {
        return cache.context;
    },
    setConfig(data) {
        cache.config = data;
    },
    getConfig() {
        return cache.config;
    },
    setLocales(data) {
        cache.locales = data;
    },
    getLocales() {
        return cache.locales;
    },
    setReverseLocale(data) {
        cache.reverseLocale = data;
    },
    getReverseLocale() {
        return cache.reverseLocale;
    },
    t(value, language, namespace = "global") {
        const code = cache.reverseLocale[value];
        return cache.locales[language][namespace][code];
    },
};
