import React from "react";

const Index = () => {
    const common = i18n("中国", "zh", "g")
    const common2 = i18n("中国2", "zh")
    return (
        <div>
            <i18n namespace="global">名字</i18n>
            <i18n namespace="global">名字</i18n>
            <i18n namespace="global3">名字3</i18n>
            <div>
                <a></a>
            </div>
        </div>

    );
};

export default Index;
