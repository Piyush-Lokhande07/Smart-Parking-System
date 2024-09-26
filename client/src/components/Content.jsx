import React from "react";
import Home from "./Home";
import AboutUs from "./AboutUs";

function Content({ isHomeActive, isAboutUsActive }) {
    return (
        <div>
            {isHomeActive && <Home />}
            {isAboutUsActive && <AboutUs />} 
        </div>
    );
}

export default Content;
