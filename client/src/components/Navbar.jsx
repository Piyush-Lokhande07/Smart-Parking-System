import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from './Login';
import SignUp from './SignUp';

function Navbar() {
    const [popupType, setPopupType] = useState(""); 
    const [isPopupOpen, setIsPopupOpen] = useState(false); 
    const [popupMessage, setPopupMessage] = useState(""); // State for popup messages

    const openPopup = (type) => {
        setPopupType(type);
        setIsPopupOpen(true);
        setPopupMessage(""); // Reset message when opening popup
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setPopupMessage(""); // Clear message on close
    };

    const handleSuccessMessage = (message) => {
        setPopupMessage(message);
        setTimeout(() => {
            closePopup(); // Close popup after 3 seconds
        }, 2000);
    };

    return (
        <div>
            <nav>
                <div><Link to="/" className='nav-btn nav-lk'>Home</Link></div>
                <div><Link to="/about-us" className='nav-btn nav-lk'>About Us</Link></div>
                <button className='nav-btn'>Add Parking Location</button>
                <button className='nav-btn' onClick={() => openPopup("login")}>Login</button>
                <button className='nav-btn' onClick={() => openPopup("signup")}>Sign Up</button>
            </nav>

            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={closePopup}>&times;</span>
                        {popupMessage ? (
                            <div>{popupMessage}</div> // Show the message if it exists
                        ) : (
                            <>
                                {popupType === "login" && <Login onSuccess={handleSuccessMessage} />}
                                {popupType === "signup" && <SignUp onSuccess={handleSuccessMessage} />}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;
