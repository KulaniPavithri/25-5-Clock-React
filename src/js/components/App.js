import React from "react";
import ReactDOM from 'react-dom';
import Timer from './25-5-clock';

const App = () => {
    return(
        <div>
            <Timer />
        </div>
    );
}

ReactDOM.render(<App/>, document.getElementById("root"));