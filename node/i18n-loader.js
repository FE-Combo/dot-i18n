require("../node/preOperation");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse");
const babelGenerator = require("@babel/generator");
const babelTypes = require("@babel/types");
const i18nStore = require("./i18n-store");

function findI18nTag(node) {
    if ((node.openingElement && node.openingElement.name.name === "i18n") || (node.argument && node.argument.openingElement && node.argument.openingElement.name.name === "i18n")) {
        const jsxNode = node || node.argument;
        const openingElement = jsxNode.openingElement;
        const attributes = openingElement.attributes;
        const namespaceAttribute = attributes.find((_) => _.name === "namespace");
        const namespace = (namespaceAttribute && namespaceAttribute.value.value) || "global";
        if (jsxNode.children && jsxNode.children[0] && jsxNode.children[0].value) {
            const value = jsxNode.children[0].value;
            const reverseLocale = i18nStore.getReverseLocale();
            if (value && reverseLocale && reverseLocale[namespace]) {
                const code = reverseLocale[namespace][value];
                openingElement.attributes = [];
                openingElement.name.name = "";
                jsxNode.closingElement.name.name = "";
                if (code) {
                    jsxNode.children[0].value = `{_$$t && _$$t["${namespace}"] && _$$t["${namespace}"]["${code}"] || "${value}"}`;
                }
            }
        }
    }
    if ((node.children && node.children.length > 0) || (node.argument && node.argument.children && node.argument.children.length > 0)) {
        const children = node.children || node.argument.children;
        children.forEach((_) => {
            findI18nTag(_);
        });
    }
}

module.exports = function (context) {
    let nextContext = context;
    const i18nConfig = i18nStore.getConfig();

    if (nextContext.includes(`<${i18nConfig.template}`) || nextContext.includes(`${i18nConfig.template}(`)) {
        const importTemplate = `import * as _$$I18nStore from "../node/i18n-store.js";\n`;
        const ast = babelParser.parse(
            `
${importTemplate}
${nextContext}      
            `,
            {
                sourceType: "module",
                plugins: ["typescript", "jsx"],
            }
        );
        babelTraverse.default(ast, {
            CallExpression(path) {
                path.get("i18n").container.callee.name = `_$$I18nStore.t`;
            },
            FunctionDeclaration(path) {
                path.get("body").unshiftContainer("body", babelTypes.expressionStatement(babelTypes.identifier("const _$$t = _$$I18nStore.useLocales()")));
            },
            ArrowFunctionExpression(path) {
                path.get("body").unshiftContainer("body", babelTypes.expressionStatement(babelTypes.identifier("const _$$t = _$$I18nStore.useLocales()")));
            },
            ReturnStatement(path) {
                findI18nTag(path.node);
            },
        });
        return babelGenerator.default(ast).code;
    }
    return nextContext;
};
