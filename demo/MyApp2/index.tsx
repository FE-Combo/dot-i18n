// In dev env and under this path, don't use i18n, because auto import dot-i18n

import React, { useState } from "react";

interface Props {
    text: React.ReactNode;
}

const App = (props: Props) => {
    const [count, setCount] = useState(0)
    return (
        <div>
            {count}
            <button onClick={() => setCount(count + 1)}>{props.text}</button>
        </div>
    );
};

export default React.memo(App);
