import React, { useContext, useState } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 
import Login from './Login';
import SignUp from './SignUp';
import { AuthContext } from './AuthContext';

function Navbar() {
    const { isLoggedIn, logout } = useContext(AuthContext); 
    const [popupType, setPopupType] = useState(""); 
    const [isPopupOpen, setIsPopupOpen] = useState(false); 
    const [popupMessage, setPopupMessage] = useState(""); 
    const navigate = useNavigate();

    const openPopup = (type) => {
        setPopupType(type);
        setIsPopupOpen(true);
        setPopupMessage(""); 
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setPopupMessage(""); 
    };

    const handleSuccessMessage = (message, loggedIn = false) => {
        setPopupMessage(message);
        if (loggedIn) {
          
        }
        setTimeout(() => {
            closePopup();
        }, 3000);
    };

    const handleLogout = () => {
        logout(); 
        navigate("/"); 
    };

    const handleAddParkingLocation = () => {
        if (!isLoggedIn) {
            setPopupMessage("You are not Logged in!");
            setIsPopupOpen(true); 
            setTimeout(() => closePopup(), 3000); 
        } else {
            navigate('/add-parking-location'); 
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
                            <div>{popupMessage}</div> 
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
