"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var I18nPlugin = /** @class */ (function () {
    function I18nPlugin(options) {
        this.options = options;
    }
    I18nPlugin.prototype.apply = function (compiler) {
        compiler.hooks.emit.tap("I18nPlugin", function (compilation) {
            // TODO
        });
    };
    return I18nPlugin;
}());
exports.default = I18nPlugin;
