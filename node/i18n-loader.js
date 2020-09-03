require("../node/preOperation");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse");
const babelGenerator = require("@babel/generator");
const babelTypes = require("@babel/types");
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
                path.get("i18n").container.callee.name = `_$$I18nStore.t`;
            },
            FunctionDeclaration(path) {
                path.get("body").unshiftContainer("body", babelTypes.expressionStatement(babelTypes.identifier("const _$$t = useState()")));
            },
            ArrowFunctionExpression(path) {
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
        });
        // console.log(babelGenerator.default(ast));
    }
    return nextContext;
};
