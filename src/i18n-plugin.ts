export default class I18nPlugin {
    options: any
    constructor(options: any) {
        this.options = options;
    }
    apply(compiler:any) {
        compiler.hooks.emit.tap("I18nPlugin", (compilation:any) => {
            // TODO
        });
    }
}
