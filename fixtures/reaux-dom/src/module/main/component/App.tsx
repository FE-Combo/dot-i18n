import React from "react";
import MyApp from "./MyApp";


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

export default App