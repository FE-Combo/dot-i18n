// In dev env and under this path, don't use i18n, because auto import dot-i18n

import React from "react";

interface Props {
    text: React.ReactNode;
}

class App extends React.PureComponent<Props> {
    render() {
        const { text } = this.props
        return (
            <div>
                {text}
            </div>
        )
    }
}

export default App;
