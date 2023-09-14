import React from "react";
import {testGlobalI18n} from "../utils";

function Index() {
    return (
        <div>
            <i18n>国庆快乐</i18n>
            自定义hooks无法生效：{testGlobalI18n()}
        </div>
    );
}

export default Index;
