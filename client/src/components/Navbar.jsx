import React, { useState } from "react";
import Login from './Login';
import Register from './SignUp';
import Content from './Content'; // Import Content component

function Navbar() {
    const [popupType, setPopupType] = useState(""); 
    const [isPopupOpen, setIsPopupOpen] = useState(false); 
    const [aboutUsClicked, setAboutUsClicked] = useState(false); // Handle "About Us" click

    const openPopup = (type) => {
        setPopupType(type);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const handleAboutUs = () => {
        setAboutUsClicked(true); // Set to true when About Us is clicked
    };

    return (
        <div>
            <nav>
                <button className='nav-btn' onClick={() => setAboutUsClicked(false)}>Home</button> {/* Set to false for Home */}
                <button className='nav-btn' onClick={handleAboutUs}>About Us</button>
                <button className='nav-btn'>Add Parking Location</button>
                <button className='nav-btn' onClick={() => openPopup("login")}>Login</button>
                <button className='nav-btn' onClick={() => openPopup("signup")}>Sign Up</button>
            </nav>

            <Content aboutUsClicked={aboutUsClicked} /> {/* Pass aboutUsClicked to Content */}

            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={closePopup}>&times;</span>
                        {popupType === "login" && <Login />}
                        {popupType === "signup" && <Register />}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;
