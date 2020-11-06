import React, { useEffect } from "react";
import * as I18nStore from "../node/i18n-store.js";
import locales from "./locales"
import ReactDOM from "react-dom";
import MyApp from "./MyApp"
I18nStore.createContext();
const I18nContext = I18nStore.getContext();

const test = {
    i18n: function (text: string) {
        return text
    }
}

const App = (props: any) => {
    const { text = "" } = props;
    const v = "vvv"
    const happy = i18n("value快乐{value}", { replace: { "{value}": v } })
    const iii = test.i18n("测试");

    useEffect(() => {
        // (window as any).i18n = (text: string) => text
        // Don't allow
        // i18n("全局测试")
    }, [])

    return (
        <div>
            {text}
            <i18n>中秋value</i18n>
            <i18n>国庆</i18n>
            <i18n>团圆</i18n>
            {happy}
            {iii}
            <MyApp text={<div>
                <div>
                    <div>
                        <i18n>回家</i18n>
                    </div>
                </div>
            </div>} />
        </div>
    );
};

class Index extends React.Component {
    render() {
        return (
            <I18nContext.Provider value={locales.en}>
                <App />
            </I18nContext.Provider>
        );
    }
}

const rootElement: HTMLDivElement = document.createElement("div");
rootElement.id = "framework-app-root";
document.body.appendChild(rootElement);
ReactDOM.render(<Index />, rootElement);
