class I18nPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.emit.tap("I18nPlugin", (compilation) => {
            // TODO
        });
    }
}
module.exports = I18nPlugin;
