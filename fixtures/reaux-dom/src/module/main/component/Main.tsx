import React from "react";
import DotI18n from "dot-i18n"
import App from "./App"
const locales = require("../../../locales");

class Main extends React.PureComponent {
    render() {
        return (
            <DotI18n.Provider locales={locales.en}>
                <App />
            </DotI18n.Provider>
        );
    }
}

export default Main;
