const I18nStore = require("./i18n-store");
module.exports = function (context, a) {
    console.log(111);
    let nextContext = context;
    const i18nStore = I18nStore.getStore();
    console.log(i18nStore);
    const regex = /\<i18n((.*?)\=(.*?))*?\>(.+?)<\/i18n\>/g;
    if (regex.test(nextContext)) {
        const dotI18nTemplate = `
        import { getI18nContent } from "./index"
        const Context = getI18nContent();
        `;
        const matchDotI18nArray = nextContext.match(regex);
        matchDotI18nArray.map(
            (_) =>
                (nextContext = nextContext.replace(
                    _,
                    `
                        <Context.Consumer>
                        {(data)=>{
                            return data?.age
                        }}
                        </Context.Consumer>
                    `
                ))
        );
        return `
        ${dotI18nTemplate}
        ${nextContext}
        `;
    } else {
        return nextContext;
    }
};
