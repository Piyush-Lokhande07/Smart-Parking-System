import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Login from './Login';
import SignUp from './SignUp';

function Navbar() {
    const [popupType, setPopupType] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
    const navigate = useNavigate(); // Initialize navigate

    const openPopup = (type) => {
        setPopupType(type);
        setIsPopupOpen(true);
        setPopupMessage(""); // Reset message when opening popup
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setPopupMessage(""); // Clear message on close
    };

    const handleSuccessMessage = (message, loggedIn = false) => {
        setPopupMessage(message);
        if (loggedIn) {
            setIsLoggedIn(true); // Update login status
        }
        setTimeout(() => {
            closePopup(); // Close popup after 3 seconds
        }, 3000); // Adjust time as needed
    };

    const handleLogout = () => {
        setIsLoggedIn(false); // Reset login status
    };

    const handleAddParkingLocationClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault(); // Prevent navigation to the route if not logged in
            setPopupMessage("You are not Logged in!");
            setIsPopupOpen(true);
            setTimeout(() => setIsPopupOpen(false), 3000); // Auto-close popup after 3 seconds
        }
    };

    return (
        <div>
            <nav>
                <div><Link to="/" className='nav-btn nav-lk'>Home</Link></div>
                <div><Link to="/about-us" className='nav-btn nav-lk'>About Us</Link></div>
                <div>
                    <Link 
                        to="/add-parking-location" 
                        className='nav-btn nav-lk' 
                        onClick={handleAddParkingLocationClick}
                    >
                        Add Parking Location
                    </Link>
                </div>
                {isLoggedIn ? (
                    <button className='nav-btn' onClick={handleLogout}>Logout</button>
                ) : (
                    <>
                        <button className='nav-btn' onClick={() => openPopup("login")}>Login</button>
                        <button className='nav-btn' onClick={() => openPopup("signup")}>Sign Up</button>
                    </>
                )}
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
