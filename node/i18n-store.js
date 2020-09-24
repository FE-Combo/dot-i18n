const {createContext, useContext} = require("react");

const cache = {};

function useLocales() {
    return useContext(cache.context);
}

module.exports = {
    useLocales,
    createContext() {
        cache.context = createContext("");
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
    t(value, options, currentLocale, reverseLocaleString) {
        const namespace = typeof options === ("string" ? options : options && options.namespace) || "global";
        const reverseLocale = JSON.parse(reverseLocaleString);
        if (reverseLocale && reverseLocale[namespace] && reverseLocale[namespace][value] && currentLocale && currentLocale[namespace]) {
            const code = reverseLocale[namespace][value];
            if (currentLocale[namespace][code]) {
                return currentLocale[namespace][code];
            }
        }
        return value;
    },
};
