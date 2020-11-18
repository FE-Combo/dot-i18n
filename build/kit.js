"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.astFunctionInsertContext = exports.spawn = void 0;
var tslib_1 = require("tslib");
var child_process_1 = tslib_1.__importDefault(require("child_process"));
var types_1 = require("@babel/types");
function spawn(command, params) {
    var isWindows = process.platform === "win32";
    var result = child_process_1.default.spawnSync(isWindows ? command + ".cmd" : command, params, {
        stdio: "inherit",
    });
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error("non-zero exit code returned, code=" + result.status + ", command=" + command + " " + params.join(" "));
        process.exit(1);
    }
}
exports.spawn = spawn;
function astFunctionInsertContext(path) {
    var _a, _b, _c;
    var pathBody = path.get("body");
    var container = pathBody.container;
    var returnStatementItem = (_c = (_b = (_a = container === null || container === void 0 ? void 0 : container.body) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.find) === null || _c === void 0 ? void 0 : _c.call(_b, function (_) { return _.type === "ReturnStatement"; });
    if (returnStatementItem && returnStatementItem.argument && (returnStatementItem.argument.type === "JSXElement" || returnStatementItem.argument.type === "JSXFragment")) {
        pathBody.unshiftContainer("body", types_1.expressionStatement(types_1.identifier("const _$$t = _$$I18nStore.useLocales()")));
    }
}
exports.astFunctionInsertContext = astFunctionInsertContext;
