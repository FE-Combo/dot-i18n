import "./initialize";
import fs from "fs-extra";
import Store, { defaultConfig } from "../store";
import path from "path";
import {ls} from "shelljs";
import {parse} from "@babel/parser";
import {JSXElement, CallExpression, JSXIdentifier, JSXAttribute, StringLiteral, JSXText, ObjectExpression, ObjectProperty, Identifier} from "@babel/types";
import {ASTContainer} from "../type";
import babelTraverse, {NodePath} from "@babel/traverse";
import lodash from "lodash";
import {generateLocale} from "./kit";

interface MutationResultOptions {
    language?: string;
    namespace?: string;
    value?: string;
}

let result: Record<string, any> = {};

function mutationResult(options: MutationResultOptions) {
    const {language = "zh", namespace = "global", value} = options;
    if (!result[language]) {
        result[language] = {};
    }
    if (!result[language][namespace]) {
        result[language][namespace] = {};
    }
    if (value && !Object.values(result[language][namespace]).includes(value)) {
        result[language][namespace][Store.encode(value)] = value;
    }
}

function analyzeLocale(baseUrl: string, languages: string[]) {
    ls(path.join(process.cwd(), baseUrl)).forEach((file) => {
        const filePath = path.join(process.cwd(), `${baseUrl}/${file}`);
        const isFile = fs.statSync(filePath).isFile();
        if (isFile) {
            const fileString = fs.readFileSync(filePath, {encoding: "utf-8"});
            if ((file.endsWith("ts") || file.endsWith("tsx")) && (fileString.includes("<i18n") || fileString.includes("i18n("))) {
                const ast = parse(fileString, {
                    sourceType: "module",
                    plugins: ["typescript", "jsx"],
                });
                babelTraverse(ast, {
                    CallExpression(path: NodePath<CallExpression>) {
                        const i18nContainer = (path.get("i18n") as NodePath<CallExpression>).container as unknown as ASTContainer;
                        if (!i18nContainer.callee.object && i18nContainer.callee.name === "i18n") {
                            const containerArguments = i18nContainer.arguments;
                            const value = containerArguments?.[0]?.value?.toString()?.trim();
                            const language = languages?.[0];
                            let namespace = "global";
                            if(containerArguments?.[1]) {
                                const nextNamespace = (((containerArguments[1] as ObjectExpression).properties?.find( _ => (((_ as ObjectProperty)?.key as Identifier)?.name || ((_ as ObjectProperty)?.key as StringLiteral)?.value) === "namespace" ) as ObjectProperty)?.value as StringLiteral)?.value;
                                if(nextNamespace) {
                                    namespace = nextNamespace
                                }
                            }
                            mutationResult({language, namespace, value});
                        }
                    },
                    JSXElement(path: NodePath<JSXElement>) {
                        if ((path.node.openingElement?.name as JSXIdentifier)?.name === "i18n") {
                            const jsxNode = path.node;
                            const openingElement = jsxNode.openingElement;
                            const attributes = openingElement.attributes as JSXAttribute[];
                            const namespaceAttribute = attributes.find((_) => _.name.name === "namespace");
                            const namespace = (namespaceAttribute?.value as StringLiteral)?.value;
                            if (jsxNode.children.length === 1) {
                                const language = languages?.[0];
                                const value = (jsxNode.children[0] as JSXText).value?.trim?.();
                                mutationResult({language, namespace, value});
                            }
                        }
                    },
                });
            }
        } else {
            analyzeLocale(`${baseUrl}/${file}`, languages);
        }
    });
}

// 扫描项目下所有文案，并在本地生成ts
function generate() {
    const config = Store.getConfig();
    const languages = config?.languages || defaultConfig.languages;
    const baseUrl = config?.baseUrl || defaultConfig.baseUrl;
    // 项目现有 locales
    const currentLocales = Store.getLocales();

    // 扫描项目多语言
    analyzeLocale(baseUrl, languages);

    // 根据 clearLegacy 判断是否保留遗留无用词条
    // TODO: 目前只能清除主语言下的词条
    const nextResult = lodash.mergeWith(result, currentLocales, (objectValue, srcValue) => {
        if (config.clearLegacy) {
            if (objectValue) {
                return objectValue;
            } else {
                return srcValue;
            }
        }
    });
    // 重新生成 locales
    generateLocale(config, languages, nextResult);

    console.info("Update locales successfully");
}

generate();
