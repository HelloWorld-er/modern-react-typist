import React from "react";
import ReactDOM from "react-dom/client";
import Typist from "../../dist/Typist";

export default function App() {
    console.log("App");
    return (
        <Typist>
            <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum, quia.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, minima?</p>
            </div>
        </Typist>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
