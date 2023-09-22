import {parse} from "@babel/parser";
import babelTraverse, {NodePath} from "@babel/traverse";
import babelGenerator from "@babel/generator";
import {expressionStatement, identifier, CallExpression, BlockStatement, ArrowFunctionExpression, FunctionDeclaration, JSXElement, JSXIdentifier, JSXAttribute, StringLiteral, stringLiteral, JSXText, importDeclaration, importDefaultSpecifier} from "@babel/types";
import {ASTContainer} from "./type";
import Store from "./store";

// dot-i18n-loader 负责在组件中导入 dot-i18n 组件中并转换i18n标签和函数。
// encode为什么不直接使用dot-i18n暴露的方法？dot-i18n-loader 本身不依赖 dot-i18n，本地调试时 dot-i18n 还未编译完成

// 函数插入 context
export function astFunctionInsertContext(path: NodePath<FunctionDeclaration> | NodePath<ArrowFunctionExpression>) {
    const pathBody = path.get("body") as NodePath<BlockStatement>;
    // 只在顶层函数中插入 useLocales
    if (pathBody.scope.path.context.scope.block.type === "Program") {
        const container = pathBody.container as unknown as ASTContainer;
        // 必须保证 return 必须为 JSXElement
        const returnStatementItem = container?.body?.body?.find?.((_) => _.type === "ReturnStatement");
        if (returnStatementItem && returnStatementItem.argument && (returnStatementItem.argument.type === "JSXElement" || returnStatementItem.argument.type === "JSXFragment")) {
            pathBody.unshiftContainer("body", expressionStatement(identifier("const _$$t = _$$DotI18n.useLocales()")));
        }
    }
}

export default function (context: string) {
    let nextContext = context;
    if (nextContext.includes("<i18n") || nextContext.includes("i18n(")) {
        const ast = parse(nextContext, {
            sourceType: "module",
            plugins: ["typescript", "jsx"],
        });
        babelTraverse(ast, {
            // @babel/types/lib/index.d.ts => declare type Node
            Program(path) {
                path.node.body.unshift(importDeclaration([importDefaultSpecifier(identifier("_$$DotI18n"))], stringLiteral("dot-i18n")));
            },
            FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
                astFunctionInsertContext(path);
            },
            ArrowFunctionExpression(path: NodePath<ArrowFunctionExpression>) {
                astFunctionInsertContext(path);
            },
            CallExpression(path: NodePath<CallExpression>) {
                // e.g: i18n("测试")
                const container = (path.get("i18n") as NodePath<CallExpression>).container as unknown as ASTContainer;
                if (!container.callee.object && container.callee.name === "i18n") {
                    container.callee.name = `_$$DotI18n.t`;
                    const containerArguments = container.arguments;
                    if (containerArguments.length === 1) {
                        containerArguments.push({type: "StringLiteral", value: "global"});
                    }
                    containerArguments.push({type: "Identifier", name: "typeof _$$t ==='object'? _$$t : null"});
                }
            },
            // TODO: JSXOpeningElement、JSXClosingElement
            JSXElement(path: NodePath<JSXElement>) {
                // e.g : <i18n>测试</18n>
                if ((path?.node?.openingElement?.name as JSXIdentifier)?.name === "i18n") {
                    const jsxNode = path.node;
                    const openingElement = jsxNode.openingElement;
                    const attributes = openingElement.attributes as JSXAttribute[];
                    const namespaceAttribute = attributes.find((_) => _.name.name === "namespace")!;
                    const namespace = (namespaceAttribute?.value as StringLiteral)?.value || "global";
                    const value = (jsxNode?.children?.[0] as JSXText)?.value?.trim?.();
                    if (value) {
                        const code = Store.encode(value)
                        if (code) {
                            openingElement.attributes = [];
                            (openingElement.name as JSXIdentifier).name = "";
                            (jsxNode.closingElement!.name as JSXIdentifier).name = "";
                            (jsxNode.children[0] as JSXText).value = `{_$$t?.["${namespace}"]?.["${code}"] || "${value?.toString()?.trim?.()}"}`;
                        }
                    }
                }
            },
        });
        const result = babelGenerator(ast).code;
        if (process.env.DOT_I18N_DEBUG) {
            console.info(result);
        }
        return result;
    }
    return nextContext;
}
