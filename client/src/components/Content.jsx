import React from "react";
import Home from "./Home";
import AboutUs from "./AboutUs";


function Content({aboutUsClicked}){
    return(
        <div>
            {!aboutUsClicked ? <Home /> : <AboutUs />}
        </div>
    )
}
export default Content;