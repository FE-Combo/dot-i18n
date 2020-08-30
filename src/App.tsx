import React from "react";
import locales from "./locales";
import * as I18nStore from "../node/i18n-store.js";
import ReactDOM from "react-dom";
import MyApp from "./MyApp";

I18nStore.createContext()
const I18nContext = I18nStore.getContext()

const Index = () => {
    console.log(locales.zh)
    return (
        <I18nContext.Provider value={locales.zh}>
            <MyApp />
        </I18nContext.Provider>
    );
};

const rootElement: HTMLDivElement = document.createElement("div");
rootElement.id = "framework-app-root";
document.body.appendChild(rootElement);
ReactDOM.render(<Index />, rootElement);
