require("./preOperation");
const fs = require("fs-extra");
const i18nStore = require("./i18n-store");
const path = require("path");
const shelljs = require("shelljs");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse");
const {findI18nTag, spawn} = require("./kit");

let result = {};
let currentTime = new Date().getTime();

function analyzeLocale(source, languages) {
    shelljs.ls(path.join(process.cwd(), source)).forEach((file) => {
        const filePath = path.join(process.cwd(), `${source}/${file}`);
        const isFile = fs.statSync(filePath).isFile();

        if (isFile) {
            const fileString = fs.readFileSync(filePath, {encoding: "utf-8"});
            if ((file.endsWith("ts") || file.endsWith("tsx")) && (fileString.includes("<i18n") || fileString.includes("i18n("))) {
                const ast = babelParser.parse(fileString, {
                    sourceType: "module",
                    plugins: ["typescript", "jsx"],
                });
                babelTraverse.default(ast, {
                    CallExpression(path) {
                        const i18nContainer = path.get("i18n").container;
                        if (!i18nContainer.callee.object) {
                            const arguments = i18nContainer.arguments;
                            const value = arguments && arguments[0] && arguments[0].value;
                            const language = (languages && languages[0]) || "zh";
                            const namespace = (arguments && arguments[2] && arguments[2].value) || "global";
                            if (!result[language]) {
                                result[language] = {};
                            }
                            if (!result[language][namespace]) {
                                result[language][namespace] = {};
                            }
                            if (value && !Object.values(result[language][namespace]).includes(value)) {
                                result[language][namespace][(currentTime++).toString(16)] = value;
                            }
                        }
                    },
                    JSXElement(path) {
                        if (path.node.openingElement && path.node.openingElement.name && path.node.openingElement.name.name === "i18n") {
                            const jsxNode = path.node;
                            const openingElement = jsxNode.openingElement;
                            const attributes = openingElement.attributes;
                            const namespaceAttribute = attributes.find((_) => _.name.name === "namespace");
                            const namespace = (namespaceAttribute && namespaceAttribute.value.value) || "global";
                            if (jsxNode.children.length === 1) {
                                const language = (languages && languages[0]) || "zh";
                                const value = jsxNode.children[0].value;
                                if (!result[language]) {
                                    result[language] = {};
                                }
                                if (!result[language][namespace]) {
                                    result[language][namespace] = {};
                                }
                                if (value && !Object.values(result[language][namespace]).includes(value)) {
                                    result[language][namespace][(currentTime++).toString(16)] = value;
                                }
                            }
                        }
                    },
                });
            }
        } else {
            analyzeLocale(`${source}/${file}`, languages);
        }
    });
}

function generateLocale(config) {
    const languages = config.languages;
    const prettierConfig = config.prettierConfig;
    const localePath = config.localePath;
    fs.ensureDirSync(path.join(process.cwd(), config.localePath));
    fs.ensureFileSync(path.join(process.cwd(), `${config.localePath}/index.ts`));
    let indexTemplate = `/*
    Attention: This file is generated by "dot-icon", do not modify
    ref: https://github.com/vocoWone/dot-i18n
*/\n\n`;
    languages.forEach((_) => {
        fs.ensureFileSync(path.join(process.cwd(), `${config.localePath}/${_}.ts`));
        fs.writeFileSync(path.join(process.cwd(), `${config.localePath}/${_}.ts`), `export default ${JSON.stringify(result[_])};\n`);
        indexTemplate += `import ${_} from "./${_}";\n`;
    });
    indexTemplate += `\nexport default {${languages.join(", ")}};\n`;
    fs.writeFileSync(path.join(process.cwd(), `${config.localePath}/index.ts`), indexTemplate);

    if (prettierConfig) {
        spawn("prettier", ["--config", path.join(process.cwd(), prettierConfig), "--write", path.join(process.cwd(), localePath + "/*")]);
    }
}

function generate() {
    const allLocales = i18nStore.getLocales();
    if (allLocales instanceof Object) {
        result = i18nStore.getLocales();
    }

    const config = i18nStore.getConfig();
    const languages = config.languages;
    const source = config.source;

    analyzeLocale(source, languages);
    generateLocale(config);
}

generate();
