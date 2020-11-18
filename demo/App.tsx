import React, { useEffect, useState, useMemo } from "react";
import * as I18nStore from "../build/i18n-store";
import locales from "./locales"
import ReactDOM from "react-dom";
import MyApp from "./MyApp"
import MyApp2 from "./MyApp2"
import MyApp3 from "./MyApp3"

const test = {
    i18n: function (text: string) {
        return text
    }
}

function App(props: any) {
    const { text = "" } = props;
    const customLocales = I18nStore.useLocales<typeof locales["zh"]>()
    const v = "vvv"
    const happy = i18n("value快乐{value}", { replace: { "{value}": v } })
    const happy2 = i18n("快乐2")
    const iii = test.i18n("测试");
    const [status, setStatus] = useState(0)

    useEffect(() => {
        // (window as any).i18n = (text: string) => text
        // Don't allow
        // i18n("全局测试")
        setStatus(1)
    }, [])

    const render = () => {
        switch (status) {
            case 0:
                return <div><i18n>未实名</i18n></div>;
            case 1:
                return <div><i18n>已实名</i18n></div>;
            default:
                return null;
        }
    };

    const myApp3Span = <span>MyApp3 span</span>
    const memoMyApp3Span = useMemo(() => myApp3Span, [])

    return (
        <div>
            {text}
            <br />
            <i18n>中秋value</i18n>
            <br />
            <i18n>国庆</i18n>
            <br />
            <i18n>团圆</i18n>
            <br />
            {happy}
            {happy2}
            <br />
            {iii}
            <br />
            {render()}
            <br />
            <MyApp text={<div>
                <div>
                    <div>
                        <i18n>回家</i18n>
                    </div>
                </div>
            </div>} />
            <MyApp2 text="MyApp2" />
            <MyApp2 text={<i18n>MyApp2</i18n>} /> {/* 重新render */}
            <button onClick={() => setStatus((status + 1) % 2)}><i18n>按钮2</i18n></button>
            <MyApp3 text={"MyApp3"} />
            <MyApp3 text={<i18n>MyApp3</i18n>} />{/* 重新render */}
            <MyApp3 text={memoMyApp3Span} />
            <MyApp3 text={myApp3Span} />{/* 重新render */}
        </div>
    );
};

class Index extends React.Component {
    render() {
        return (
            <I18nStore.LocaleProvider locales={locales} language="en">
                <App />
            </I18nStore.LocaleProvider >
        );
    }
}

const rootElement: HTMLDivElement = document.createElement("div");
rootElement.id = "framework-app-root";
document.body.appendChild(rootElement);
ReactDOM.render(<Index />, rootElement);
