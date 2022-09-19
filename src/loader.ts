import "./initialize";
import {parse} from "@babel/parser";
import babelTraverse, {NodePath} from "@babel/traverse";
import babelGenerator from "@babel/generator";
import { identifier, CallExpression, ArrowFunctionExpression, FunctionDeclaration, JSXElement, JSXIdentifier, JSXAttribute, StringLiteral, stringLiteral, JSXText,importDeclaration,importDefaultSpecifier,expressionStatement} from "@babel/types";
import * as i18nStore from "./store";
import {astFunctionInsertContext} from "./kit"

export default function (context: string) {
    let nextContext = context;
    const i18nConfig = i18nStore.getConfig();
    if (nextContext.includes(`<i18n`) || nextContext.includes(`i18n(`)) {
        const reverseLocale = i18nStore.getReverseLocale();
        const ast = parse(nextContext,
            {
                sourceType: "module",
                plugins: ["typescript", "jsx"],
            }
        );
        babelTraverse(ast, {
            Program(path) {
                path.node.body.unshift(importDeclaration([importDefaultSpecifier(identifier("* as _$$I18nStore"))],i18nConfig?.isDev?stringLiteral("../build/i18n-store"):stringLiteral("dot-i18n/i18n-store")))
            },
            FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
                astFunctionInsertContext(path)
            },
            ArrowFunctionExpression(path: NodePath<ArrowFunctionExpression>) {
                astFunctionInsertContext(path)
            },
            CallExpression(path: NodePath<CallExpression>) {
                // e.g: i18n("测试")
                const container = (path.get("i18n") as NodePath<CallExpression>).container as i18nStore.ASTContainer;
                if (!container.callee.object && container.callee.name === "i18n") {
                    container.callee.name = `_$$I18nStore.t`;
                    const containerArguments = container.arguments;
                    if (containerArguments.length === 1) {
                        containerArguments.push({type: "StringLiteral", value: "global"});
                    }
                    containerArguments.push({type: "Identifier", name: "typeof _$$t ==='object'? _$$t : null"});
                }
            },
            JSXElement(path: NodePath<JSXElement>) {
                // e.g : <i18n>测试</18n>
                if ((path?.node?.openingElement?.name as JSXIdentifier)?.name === "i18n") {
                    const jsxNode = path.node;
                    const openingElement = jsxNode.openingElement;
                    const attributes = openingElement.attributes as JSXAttribute[];
                    const namespaceAttribute = attributes.find((_) => _.name.name === "namespace")!;
                    const namespace = (namespaceAttribute?.value as StringLiteral)?.value || "global";
                    const value = (jsxNode?.children?.[0] as JSXText)?.value;
                    if (value && reverseLocale?.[namespace]) {
                        const code = reverseLocale?.[namespace]?.[value];
                        if (code) {
                            openingElement.attributes = [];
                            (openingElement.name as JSXIdentifier).name = "";
                            (jsxNode.closingElement!.name as JSXIdentifier).name = "";
                            (jsxNode.children[0] as JSXText).value = `{_$$t && _$$t["${namespace}"] && _$$t["${namespace}"]["${code}"] || "${value}"}`;
                        }
                    }
                }
            },
        });
        const result = babelGenerator(ast).code
        return result;
    }
    return nextContext;
}
