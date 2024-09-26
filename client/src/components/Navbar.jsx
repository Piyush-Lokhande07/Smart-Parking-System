import React, { useContext, useState } from "react"; 
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Login from './Login';
import SignUp from './SignUp';
import { AuthContext } from './AuthContext'; // Import AuthContext

function Navbar() {
    const { isLoggedIn, logout } = useContext(AuthContext); // Get login status and logout function
    const [popupType, setPopupType] = useState(""); 
    const [isPopupOpen, setIsPopupOpen] = useState(false); 
    const [popupMessage, setPopupMessage] = useState(""); 
    const navigate = useNavigate(); // Initialize useNavigate

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
            // Nothing needed here as we manage login in AuthContext
        }
        setTimeout(() => {
            closePopup(); // Close popup after 3 seconds
        }, 3000); // Adjust time as needed
    };

    const handleLogout = () => {
        logout(); // Call logout from AuthContext
        navigate("/"); // Redirect to home after logout
    };

    const handleAddParkingLocation = () => {
        if (!isLoggedIn) {
            setPopupMessage("You are not Logged in!"); // Show warning message
            setIsPopupOpen(true); // Open popup
            setTimeout(() => closePopup(), 3000); // Auto-close after 3 seconds
        } else {
            navigate('/add-parking-location'); // Navigate to AddParkingLocation
        }
    };

    return (
        <div>
            <nav>
                <div><Link to="/" className='nav-btn nav-lk'>Home</Link></div>
                <div><Link to="/about-us" className='nav-btn nav-lk'>About Us</Link></div>
                <button className='nav-btn' onClick={handleAddParkingLocation}>Add Parking Location</button>
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
