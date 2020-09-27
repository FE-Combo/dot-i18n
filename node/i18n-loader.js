require("./preOperation");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse");
const babelGenerator = require("@babel/generator");
const babelTypes = require("@babel/types");
const i18nStore = require("./i18n-store");
const {findI18nTag} = require("./kit");

module.exports = function (context) {
    let nextContext = context;
    const i18nConfig = i18nStore.getConfig();

    if (nextContext.includes(`<${i18nConfig.template}`) || nextContext.includes(`${i18nConfig.template}(`)) {
        const importTemplate = `import * as _$$I18nStore from "${i18nConfig.isDev ? "../node/i18n-store.js" : "dot-i18n/node/i18n-store.js"}";\n`;
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
                const container = path.get("i18n").container;
                if (container.callee.name === "i18n") {
                    container.callee.name = `_$$I18nStore.t`;
                    const arguments = container.arguments;
                    if (arguments.length === 1) {
                        arguments.push({type: "StringLiteral", value: "global"});
                    }
                    arguments.push({type: "Identifier", name: "_$$t"});
                    arguments.push({type: "StringLiteral", value: JSON.stringify(i18nStore.getReverseLocale())});
                }
            },
            FunctionDeclaration(path) {
                path.get("body").unshiftContainer("body", babelTypes.expressionStatement(babelTypes.identifier("const _$$t = _$$I18nStore.useLocales()")));
            },
            ArrowFunctionExpression(path) {
                const container = path.get("body").container;
                const returnStatementItem = container && container.body && container.body.body && container.body.body.find((_) => _.type === "ReturnStatement");
                if (returnStatementItem && returnStatementItem.argument && (returnStatementItem.argument.type === "JSXElement" || returnStatementItem.argument.type === "JSXFragment")) {
                    path.get("body").unshiftContainer("body", babelTypes.expressionStatement(babelTypes.identifier("const _$$t = _$$I18nStore.useLocales()")));
                }
            },
            ReturnStatement(path) {
                findI18nTag(path.node, function (jsxNode) {
                    const openingElement = jsxNode.openingElement;
                    const attributes = openingElement.attributes;
                    const namespaceAttribute = attributes.find((_) => _.name.name === "namespace");
                    const namespace = (namespaceAttribute && namespaceAttribute.value.value) || "global";

                    if (jsxNode.children && jsxNode.children[0] && jsxNode.children[0].value) {
                        const value = jsxNode.children[0].value;
                        const reverseLocale = i18nStore.getReverseLocale();
                        if (value && reverseLocale && reverseLocale[namespace]) {
                            const code = reverseLocale[namespace][value];
                            if (code) {
                                openingElement.attributes = [];
                                openingElement.name.name = "";
                                jsxNode.closingElement.name.name = "";
                                jsxNode.children[0].value = `{_$$t && _$$t["${namespace}"] && _$$t["${namespace}"]["${code}"] || "${value}"}`;
                            }
                        }
                    }
                });
            },
        });
        return babelGenerator.default(ast).code;
    }
    return nextContext;
};
