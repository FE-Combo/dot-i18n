"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("./initialize");
var parser_1 = require("@babel/parser");
var traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
var generator_1 = tslib_1.__importDefault(require("@babel/generator"));
var types_1 = require("@babel/types");
var i18nStore = tslib_1.__importStar(require("./i18n-store"));
var kit_1 = require("./kit");
function default_1(context) {
    var nextContext = context;
    var i18nConfig = i18nStore.getConfig();
    if (nextContext.includes("<i18n") || nextContext.includes("i18n(")) {
        var reverseLocale_1 = i18nStore.getReverseLocale();
        var ast = parser_1.parse(nextContext, {
            sourceType: "module",
            plugins: ["typescript", "jsx"],
        });
        traverse_1.default(ast, {
            Program: function (path) {
                path.node.body.unshift(types_1.importDeclaration([types_1.importDefaultSpecifier(types_1.identifier("* as _$$I18nStore"))], (i18nConfig === null || i18nConfig === void 0 ? void 0 : i18nConfig.isDev) ? types_1.stringLiteral("../build/i18n-store") : types_1.stringLiteral("dot-i18n/i18n-store")));
            },
            FunctionDeclaration: function (path) {
                kit_1.astFunctionInsertContext(path);
            },
            ArrowFunctionExpression: function (path) {
                kit_1.astFunctionInsertContext(path);
            },
            CallExpression: function (path) {
                // e.g: i18n("测试")
                var container = path.get("i18n").container;
                if (!container.callee.object && container.callee.name === "i18n") {
                    container.callee.name = "_$$I18nStore.t";
                    var containerArguments = container.arguments;
                    if (containerArguments.length === 1) {
                        containerArguments.push({ type: "StringLiteral", value: "global" });
                    }
                    containerArguments.push({ type: "Identifier", name: "typeof _$$t ==='object'? _$$t : null" });
                }
            },
            JSXElement: function (path) {
                var _a, _b, _c, _d, _e, _f, _g;
                // e.g : <i18n>测试</18n>
                if (((_c = (_b = (_a = path === null || path === void 0 ? void 0 : path.node) === null || _a === void 0 ? void 0 : _a.openingElement) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.name) === "i18n") {
                    var jsxNode = path.node;
                    var openingElement = jsxNode.openingElement;
                    var attributes = openingElement.attributes;
                    var namespaceAttribute = attributes.find(function (_) { return _.name.name === "namespace"; });
                    var namespace = ((_d = namespaceAttribute === null || namespaceAttribute === void 0 ? void 0 : namespaceAttribute.value) === null || _d === void 0 ? void 0 : _d.value) || "global";
                    var value = (_f = (_e = jsxNode === null || jsxNode === void 0 ? void 0 : jsxNode.children) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value;
                    if (value && (reverseLocale_1 === null || reverseLocale_1 === void 0 ? void 0 : reverseLocale_1[namespace])) {
                        var code = (_g = reverseLocale_1 === null || reverseLocale_1 === void 0 ? void 0 : reverseLocale_1[namespace]) === null || _g === void 0 ? void 0 : _g[value];
                        if (code) {
                            openingElement.attributes = [];
                            openingElement.name.name = "";
                            jsxNode.closingElement.name.name = "";
                            jsxNode.children[0].value = "{_$$t && _$$t[\"" + namespace + "\"] && _$$t[\"" + namespace + "\"][\"" + code + "\"] || \"" + value + "\"}";
                        }
                    }
                }
            },
        });
        var result = generator_1.default(ast).code;
        return result;
    }
    return nextContext;
}
exports.default = default_1;
