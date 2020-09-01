require("../node/preOperation");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse");
const babelGenerator = require("@babel/generator");
const babelTypes = require("@babel/types");
const loaderUtils = require("loader-utils");
const i18nStore = require("./i18n-store");

module.exports = function (context) {
    let nextContext = context;
    const resourcePath = this.resourcePath;
    const i18nConfig = i18nStore.getConfig();
    if (nextContext.includes(i18nConfig.template)) {
        const importTemplate = `import * as _$$I18nStore from "../node/i18n-store.js";`;
        const ast = babelParser.parse(
            `
                ${importTemplate}
                import React from "react";
                g.i18n("国际","cn")
                i18n("国际","zh");
                const Index = ()=>{
                    return <i18n namespace="global">年龄</i18n>
                }
            
            `,
            {
                sourceType: "module",
                plugins: ["typescript", "jsx"],
            }
        );
        babelTraverse.default(ast, {
            CallExpression(path) {
                // 函数调用
                path.get("i18n").container.callee.name = `_$$I18nStore.t`;
            },
            FunctionDeclaration(path) {
                // 函数声明
                path.get("body").unshiftContainer("body", babelTypes.expressionStatement(babelTypes.identifier("const _$$t = useState()")));
            },
            ArrowFunctionExpression(path) {
                // 箭头函数声明
                path.get("body").unshiftContainer("body", babelTypes.expressionStatement(babelTypes.identifier("const _$$t = useState()")));
            },
            ReturnStatement(path) {
                const argument = path.get("i18n").container.argument;
                const attributes = argument.openingElement.attributes;
                const namespaceAttribute = attributes.find((_) => _.name === "namespace");
                const namespace = (namespaceAttribute && namespaceAttribute.value.value) || "global";
                const value = argument.children[0].value;
                const code = i18nStore.getReverseLocale()[namespace][value];
                argument.openingElement.attributes = [];
                argument.openingElement.name.name = "";
                argument.closingElement.name.name = "";
                if (code) {
                    argument.children[0].value = `{_$$t && _$$t.${namespace} && _$$t.${namespace}.${code} || ${value}}`;
                }
            },
            enter(path) {
                // 入口
            },
        });
        console.log(babelGenerator.default(ast));

        const matchRegex = /\<i18n((.*?)\=(.*?))*?\>(.+?)\<\/i18n\>/g;
        const replaceRegex = /<\/?i18n.*?>/g;
        const matchAttributeRegex = /\w+=['"`].*?['"`]/g;
        const reverseLocale = i18nStore.getReverseLocale();

        if (matchRegex.test(nextContext)) {
            let dotI18nTemplate = `
                import * as I18nStore from "../node/i18n-store.js";
            `;
            const matchDotI18nArray = nextContext.match(matchRegex);
            matchDotI18nArray.forEach((_) => {
                const attributes = {
                    namespace: "global",
                };
                const attributesArray = _.match(matchAttributeRegex);
                if (attributesArray && attributesArray.length > 0) {
                    attributesArray.forEach((_) => {
                        const {key, value} = _.split("=");
                        attributes[key] = value && value[(1, value.length - 2)];
                    });
                }
                nextContext = nextContext.replace(_, `<I18nStore.Context.Consumer>{(data: any) => <>{data.${attributes.namespace}.${reverseLocale.global[_.replace(replaceRegex, "")]}}</>}</I18nStore.Context.Consumer>`);
            });
            return `
            ${dotI18nTemplate}
            ${nextContext}
            `;
        }
    }
    return nextContext;
};
