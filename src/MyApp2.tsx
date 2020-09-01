import React from "react";

const Index = () => {
    const common = i18n("中国", "zh")
    return (
        <div>
            <i18n namespace="global">名字</i18n>
        </div>

    );
};

export default Index;
