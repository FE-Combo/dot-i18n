import React from "react";
import locales from "./locales"
import * as DotI18n from '../i18n-store.js';
import { getI18nContent } from "./index"
import ReactDOM from "react-dom";
import MyApp from "./MyApp"
export const I18nContext = getI18nContent()
DotI18n.setStore(locales.zh)
console.log(DotI18n.getStore())

const Index = () => {
    return (
        <I18nContext.Provider value={locales.zh}>
            <MyApp />
        </I18nContext.Provider>
    )
}

const rootElement: HTMLDivElement = document.createElement("div");
rootElement.id = "framework-app-root";
document.body.appendChild(rootElement);
ReactDOM.render(<Index />, rootElement);
