import childProcess from "child_process";
import * as i18nStore from "./i18n-store";
import {NodePath} from "@babel/traverse";
import {expressionStatement, identifier,BlockStatement, ArrowFunctionExpression, FunctionDeclaration} from "@babel/types";

export function spawn(command: string, params: string[]) {
    const isWindows = process.platform === "win32";
    const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, params, {
        stdio: "inherit",
    });
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${params.join(" ")}`);
        process.exit(1);
    }
}

export function astFunctionInsertContext (path: NodePath<FunctionDeclaration> | NodePath<ArrowFunctionExpression>){
    const pathBody = path.get("body") as NodePath<BlockStatement>
    const container = pathBody.container as i18nStore.ASTContainer;
    const returnStatementItem = container?.body?.body?.find?.((_) => _.type === "ReturnStatement");
    if (returnStatementItem && returnStatementItem.argument && (returnStatementItem.argument.type === "JSXElement" || returnStatementItem.argument.type === "JSXFragment")) {
        pathBody.unshiftContainer("body" as any, expressionStatement(identifier("const _$$t = _$$I18nStore.useLocales()")));
    }
}

