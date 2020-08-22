const i18n = {};

module.exports = {
    setStore(data) {
        i18n.data = data;
    },
    getStore(data) {
        return i18n.data;
    },
};
