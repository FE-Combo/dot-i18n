"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("./preOperation");
var parser_1 = require("@babel/parser");
var traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
var generator_1 = tslib_1.__importDefault(require("@babel/generator"));
var types_1 = require("@babel/types");
var i18nStore = tslib_1.__importStar(require("./i18n-store"));
function default_1(context) {
    var nextContext = context;
    var i18nConfig = i18nStore.getConfig();
    var reverseLocaleString = "";
    if (nextContext.includes("<" + (i18nConfig === null || i18nConfig === void 0 ? void 0 : i18nConfig.template)) || nextContext.includes((i18nConfig === null || i18nConfig === void 0 ? void 0 : i18nConfig.template) + "(")) {
        var importTemplate = "import * as _$$I18nStore from \"" + ((i18nConfig === null || i18nConfig === void 0 ? void 0 : i18nConfig.isDev) ? "../build/i18n-store.js" : "dot-i18n/node/i18n-store.js") + "\";\n";
        var ast = parser_1.parse("\n    " + importTemplate + "\n    " + nextContext + "\n                ", {
            sourceType: "module",
            plugins: ["typescript", "jsx"],
        });
        traverse_1.default(ast, {
            CallExpression: function (path) {
                var container = path.get("i18n").container;
                if (!container.callee.object && container.callee.name === "i18n") {
                    reverseLocaleString = "const _$$reverseLocaleString = '" + JSON.stringify(i18nStore.getReverseLocale()) + "';\n";
                    container.callee.name = "_$$I18nStore.t";
                    var containerArguments = container.arguments;
                    if (containerArguments.length === 1) {
                        containerArguments.push({ type: "StringLiteral", value: "global" });
                    }
                    containerArguments.push({ type: "Identifier", name: "_$$t" });
                    containerArguments.push({ type: "Identifier", name: "_$$reverseLocaleString" });
                }
            },
            FunctionDeclaration: function (path) {
                path.get("body").unshiftContainer("body", types_1.expressionStatement(types_1.identifier("const _$$t = _$$I18nStore.useLocales()")));
            },
            ArrowFunctionExpression: function (path) {
                var _a, _b, _c;
                var container = path.get("body").container;
                var returnStatementItem = (_c = (_b = (_a = container === null || container === void 0 ? void 0 : container.body) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.find) === null || _c === void 0 ? void 0 : _c.call(_b, function (_) { return _.type === "ReturnStatement"; });
                if (returnStatementItem && returnStatementItem.argument && (returnStatementItem.argument.type === "JSXElement" || returnStatementItem.argument.type === "JSXFragment")) {
                    path.get("body").unshiftContainer("body", types_1.expressionStatement(types_1.identifier("const _$$t = _$$I18nStore.useLocales()")));
                }
            },
            JSXElement: function (path) {
                var _a, _b, _c, _d, _e, _f;
                if (((_c = (_b = (_a = path === null || path === void 0 ? void 0 : path.node) === null || _a === void 0 ? void 0 : _a.openingElement) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.name) === "i18n") {
                    var jsxNode = path.node;
                    var openingElement = jsxNode.openingElement;
                    var attributes = openingElement.attributes;
                    var namespaceAttribute = attributes.find(function (_) { return _.name.name === "namespace"; });
                    var namespace = ((_d = namespaceAttribute === null || namespaceAttribute === void 0 ? void 0 : namespaceAttribute.value) === null || _d === void 0 ? void 0 : _d.value) || "global";
                    var value = (_f = (_e = jsxNode === null || jsxNode === void 0 ? void 0 : jsxNode.children) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value;
                    if (value) {
                        var reverseLocale = i18nStore.getReverseLocale();
                        if (value && reverseLocale && reverseLocale[namespace]) {
                            var code = reverseLocale[namespace][value];
                            if (code) {
                                openingElement.attributes = [];
                                openingElement.name.name = "";
                                jsxNode.closingElement.name.name = "";
                                jsxNode.children[0].value = "{_$$t && _$$t[\"" + namespace + "\"] && _$$t[\"" + namespace + "\"][\"" + code + "\"] || \"" + value + "\"}";
                            }
                        }
                    }
                }
            },
        });
        var resultContext = "" + reverseLocaleString + generator_1.default(ast).code;
        return resultContext;
    }
    return nextContext;
}
exports.default = default_1;
;
