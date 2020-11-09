import "./preOperation";
import {parse} from "@babel/parser";
import babelTraverse,{NodePath} from "@babel/traverse";
import babelGenerator from "@babel/generator";
import {expressionStatement,identifier,CallExpression,ArrowFunctionExpression,FunctionDeclaration,JSXElement,JSXIdentifier,JSXAttribute,StringLiteral,JSXText} from "@babel/types";
import * as i18nStore from "./i18n-store";

export default function (context:string) {
    let nextContext = context;
    const i18nConfig = i18nStore.getConfig();
    let reverseLocaleString = "";

    if (nextContext.includes(`<${i18nConfig?.template}`) || nextContext.includes(`${i18nConfig?.template}(`)) {
        const importTemplate = `import * as _$$I18nStore from "${i18nConfig?.isDev ? "../build/i18n-store.js" : "dot-i18n/node/i18n-store.js"}";\n`;
        const ast = parse(
            `
    ${importTemplate}
    ${nextContext}
                `,
            {
                sourceType: "module",
                plugins: ["typescript", "jsx"],
            }
        );
        babelTraverse(ast, {
            CallExpression(path:NodePath<CallExpression>) {
                const container = (path.get("i18n") as NodePath<CallExpression>).container as i18nStore.ASTContainer;
                if (!container.callee.object && container.callee.name === "i18n") {
                    reverseLocaleString = `const _$$reverseLocaleString = '${JSON.stringify(i18nStore.getReverseLocale())}';\n`;
                    container.callee.name = `_$$I18nStore.t`;
                    const containerArguments = container.arguments;
                    if (containerArguments.length === 1) {
                        containerArguments.push({type: "StringLiteral", value: "global"});
                    }
                    containerArguments.push({type: "Identifier", name: "_$$t"});
                    containerArguments.push({type: "Identifier", name: "_$$reverseLocaleString"});
                }
            },
            FunctionDeclaration(path:NodePath<FunctionDeclaration>) {
                path.get("body").unshiftContainer("body", expressionStatement(identifier("const _$$t = _$$I18nStore.useLocales()")));
            },
            ArrowFunctionExpression(path: NodePath<ArrowFunctionExpression>) {
                const container = path.get("body").container as i18nStore.ASTContainer;
                const returnStatementItem = container?.body?.body?.find?.((_) => _.type === "ReturnStatement");
                if (returnStatementItem && returnStatementItem.argument && (returnStatementItem.argument.type === "JSXElement" || returnStatementItem.argument.type === "JSXFragment")) {
                    path.get("body").unshiftContainer("body" as any, expressionStatement(identifier("const _$$t = _$$I18nStore.useLocales()")));
                }
            },
            JSXElement(path:NodePath<JSXElement>) {
                if ((path?.node?.openingElement?.name as JSXIdentifier)?.name === "i18n") {
                    const jsxNode = path.node;
                    const openingElement = jsxNode.openingElement;
                    const attributes = openingElement.attributes as JSXAttribute[];
                    const namespaceAttribute = attributes.find((_) => _.name.name === "namespace")!;
                    const namespace = (namespaceAttribute?.value as StringLiteral)?.value || "global";

                    const value = (jsxNode?.children?.[0] as JSXText)?.value;
                    if (value) {
                        const reverseLocale = i18nStore.getReverseLocale();
                        if (value && reverseLocale && reverseLocale[namespace]) {
                            const code = reverseLocale[namespace][value];
                            if (code) {
                                openingElement.attributes = [];
                                (openingElement.name as JSXIdentifier).name = "";
                                (jsxNode.closingElement!.name as JSXIdentifier).name = "";
                                (jsxNode.children[0] as JSXText).value = `{_$$t && _$$t["${namespace}"] && _$$t["${namespace}"]["${code}"] || "${value}"}`;
                            }
                        }
                    }
                }
            },
        });

        const resultContext = `${reverseLocaleString}${babelGenerator(ast).code}`;
        return resultContext;
    }
    return nextContext;
};
