import React, { useState } from "react";
import Login from './Login';
import Register from './SignUp';
import Content from './Content'; // Import Content component

function Navbar() {
    const [isHomeActive, setIsHomeActive] = useState(true); // Home state
    const [isAboutUsActive, setIsAboutUsActive] = useState(false); // About Us state
    const [popupType, setPopupType] = useState(""); 
    const [isPopupOpen, setIsPopupOpen] = useState(false); 

    // Handle popup open
    const openPopup = (type) => {
        setPopupType(type);
        setIsPopupOpen(true);
    };

    // Handle popup close
    const closePopup = () => {
        setIsPopupOpen(false);
    };

    // Click handler for Home button
    const handleHome = () => {
        setIsHomeActive(true); // Set Home active
        setIsAboutUsActive(false); // Set About Us inactive
    };

    // Click handler for About Us button
    const handleAboutUs = () => {
        setIsHomeActive(false); // Set Home inactive
        setIsAboutUsActive(true); // Set About Us active
    };

    return (
        <div>
            <nav>
                <button className='nav-btn' onClick={handleHome}>Home</button>
                <button className='nav-btn' onClick={handleAboutUs}>About Us</button>
                <button className='nav-btn'>Add Parking Location</button>
                <button className='nav-btn' onClick={() => openPopup("login")}>Login</button>
                <button className='nav-btn' onClick={() => openPopup("signup")}>Sign Up</button>
            </nav>

            {/* Render Content component with isHomeActive and isAboutUsActive passed as props */}
            <Content isHomeActive={isHomeActive} isAboutUsActive={isAboutUsActive} />

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
