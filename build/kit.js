"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawn = void 0;
var tslib_1 = require("tslib");
var child_process_1 = tslib_1.__importDefault(require("child_process"));
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
