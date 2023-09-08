import React from "react";
import DotI18n from "../build";
import ReactDOM from "react-dom";
import MyApp from "./MyApp";
const locales = require("./locales");

const App = () => {
    const text = i18n("dot-i18n{value}", {replace: {"{value}": i18n("牛逼")}});

    const render = () => {
        return (
            <div>
                <i18n>goodman</i18n>
            </div>
        );
    };
    return (
        <div>
            {text}
            <br />
            <MyApp />
            {render()}
        </div>
    );
};

class Index extends React.Component {
    render() {
        return (
            <DotI18n.Provider locales={locales.en}>
                <App />
            </DotI18n.Provider>
        );
    }
}

const rootElement: HTMLDivElement = document.createElement("div");
rootElement.id = "framework-app-root";
document.body.appendChild(rootElement);
ReactDOM.render(<Index />, rootElement);
