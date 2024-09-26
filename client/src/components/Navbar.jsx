import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from './Login';
import SignUp from './SignUp';

function Navbar() {
    const [popupType, setPopupType] = useState(""); 
    const [isPopupOpen, setIsPopupOpen] = useState(false); 

    const openPopup = (type) => {
        setPopupType(type);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div>
            <nav>
                <Link to="/" className='nav-btn'>Home</Link>
                <Link to="/about-us" className='nav-btn'>About Us</Link>
                <button className='nav-btn' onClick={() => openPopup("login")}>Login</button>
                <button className='nav-btn' onClick={() => openPopup("signup")}>Sign Up</button>
            </nav>

            
            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={closePopup}>&times;</span>
                        {popupType === "login" && <Login />}
                        {popupType === "signup" && <SignUp />}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;
