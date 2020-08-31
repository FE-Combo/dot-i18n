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
    if (resourcePath.endsWith(".tsx")) {
        if (resourcePath === "/Applications/project/own/dot-i18n/src/MyApp2.tsx") {
            const ast = babelParser.parse(
                `
                import React from "react";
                /* i18n:string */
                const Index = ()=>{
                    return <i18n namespace="namespace">123</i18n>
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
                },
                FunctionDeclaration(path) {
                    // 函数声明
                },
                ArrowFunctionExpression(path) {
                    // 箭头函数声明
                    path.get("body").unshiftContainer("body", babelTypes.expressionStatement(babelTypes.identifier("const t = useState()")));
                },
                ReturnStatement(path) {
                    path.get("i18n").container.argument.openingElement.attributes = [];
                    path.get("i18n").container.argument.openingElement.name.name = "";
                    path.get("i18n").container.argument.closingElement.name.name = "";
                    path.get("i18n").container.argument.children[0].value = "{t.global.name}";
                },
                enter(path) {
                    console.log(path.get("i18n").container.trailingComments);
                    // if (path.container.type === "JSXElement" && path.container.openingElement && path.container.openingElement.name.name === "i18n") {
                    //     path.container.openingElement.name.name = "Context";
                    //     path.container.closingElement.name.name = "Context";
                    // }
                },
            });
            console.log(babelGenerator.default(ast));
        }

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
                        attributes[key] = value[(1, value.length - 2)];
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
