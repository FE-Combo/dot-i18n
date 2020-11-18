import { NodePath } from "@babel/traverse";
import { ArrowFunctionExpression, FunctionDeclaration } from "@babel/types";
export declare function spawn(command: string, params: string[]): void;
export declare function astFunctionInsertContext(path: NodePath<FunctionDeclaration> | NodePath<ArrowFunctionExpression>): void;
