import React from "react";
import {testGlobalI18n} from "./index";

function App(props: any) {
    const {text} = props;

    return (
        <div>
            MyApp {testGlobalI18n()}
            {text}
        </div>
    );
}

export default App;
