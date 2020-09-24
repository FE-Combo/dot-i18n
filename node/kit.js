function findI18nTag(node, callback) {
    if ((node.openingElement && node.openingElement.name.name === "i18n") || (node.argument && node.argument.openingElement && node.argument.openingElement.name.name === "i18n")) {
        const jsxNode = node || node.argument;
        callback(jsxNode);
    }
    if ((node.children && node.children.length > 0) || (node.argument && node.argument.children && node.argument.children.length > 0)) {
        const children = node.children || node.argument.children;
        children.forEach((_) => {
            findI18nTag(_, callback);
        });
    }
}

module.exports = {
    findI18nTag,
};
