import React from "react";
import * as I18nStore from "../build/store";
import ReactDOM from "react-dom";
// import MyApp from "./MyApp";
const locales = require("./locales");

function App() {
    // const text = i18n("dot-i18n{value}", {replace: {"{value}": i18n("牛逼")}});

    const render = function () {
        return (
            <div>
                <i18n>goodman</i18n>
            </div>
        );
    };
    
    return (
        <div>
            {/* {text} */}
            <br />
            {/* <MyApp /> */}
            {render()}
        </div>
    );
}

class Index extends React.Component {
    render() {
        return (
            <I18nStore.LocaleProvider locales={locales.en}>
                <App />
            </I18nStore.LocaleProvider>
        );
    }
}

const rootElement: HTMLDivElement = document.createElement("div");
rootElement.id = "framework-app-root";
document.body.appendChild(rootElement);
ReactDOM.render(<Index />, rootElement);
