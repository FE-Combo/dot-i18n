// In dev env and under this path, don't use i18n

import React from "react";

const App = (props: any) => {
    const { text } = props;
    return (
        <div>MyApp
            {text}
        </div>

    );
};

export default App;
