const {createContext, useContext} = require("react");

const cache = {};

function useLocales() {
    return useContext(cache.context);
}

module.exports = {
    useLocales,
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
        if (cache.reverseLocale && cache.reverseLocale[value] && cache.locales[language] && cache.locales[language][namespace]) {
            const code = cache.reverseLocale[value];
            if (cache.locales[language][namespace][code]) {
                return cache.locales[language][namespace][code];
            }
        }
        return value;
    },
};
