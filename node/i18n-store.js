var React = require("react");

var cache = {};

function useLocales() {
    return React.useContext(cache.context);
}

module.exports = {
    useLocales,
    createContext: function () {
        cache.context = React.createContext({});
    },
    getContext: function () {
        return cache.context;
    },
    get Context() {
        return cache.context;
    },
    setConfig: function (data) {
        cache.config = data;
    },
    getConfig: function () {
        return cache.config;
    },
    setLocales: function (data) {
        cache.locales = data;
    },
    getLocales: function () {
        return cache.locales;
    },
    setReverseLocale: function (data) {
        cache.reverseLocale = data;
    },
    getReverseLocale: function () {
        return cache.reverseLocale;
    },
    t: function (value, options, currentLocale, reverseLocaleString) {
        var namespace = typeof options === ("string" ? options : options && options.namespace) || "global";
        var reverseLocale = JSON.parse(reverseLocaleString);
        if (reverseLocale && reverseLocale[namespace] && reverseLocale[namespace][value] && currentLocale && currentLocale[namespace]) {
            var code = reverseLocale[namespace][value];
            if (currentLocale[namespace][code]) {
                return currentLocale[namespace][code];
            }
        }
        return value;
    },
};
