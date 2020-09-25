import React from "react";
import * as I18nStore from "../node/i18n-store.js";
import locales from "./locales"
import ReactDOM from "react-dom";
import MyApp from "./MyApp"
I18nStore.createContext();
const I18nContext = I18nStore.getContext();


const App = () => {
    return (
        <div>
            <MyApp />
            <i18n namespace="global">中国</i18n>
            <i18n namespace="global3">名字3</i18n>
            <div>
                <a>123</a>
            </div>
        </div>

    );
};


class Index extends React.Component {
    render() {
        return (
            <I18nContext.Provider value={locales.en}>
                <App />
                <App />
                <App />
                <App />
                <App />
                <App />
                <App />
                <App />
                <App />
                <App />
                <App />
                <App />
                <App />
                <App />
                <App />
                <App />
                <App />
                <App />
            </I18nContext.Provider>
        );
    }
}


const rootElement: HTMLDivElement = document.createElement("div");
rootElement.id = "framework-app-root";
document.body.appendChild(rootElement);
ReactDOM.render(<Index />, rootElement);
