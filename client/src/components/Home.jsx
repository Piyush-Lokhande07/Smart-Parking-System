import React, { useContext } from "react";
import { AuthContext } from './AuthContext'; // Import AuthContext
import ListLocation from './ListLocation'; // Import ListLocation component
import Opengate from './Opengate'; // Import Opengate component
import ExitGate from './ExitGate'; // Import ExitGate component

function Home() {
    const { isLoggedIn, hasRegistered, isInside } = useContext(AuthContext); // Get login status, registration status, and inside status

    // Render based on the user's state
    return (
        <div className="home-container">
            {isLoggedIn ? (
                hasRegistered ? (
                    isInside ? (
                        <ExitGate />  // Render ExitGate if isInside is true
                    ) : (
                        <Opengate />  // Render Opengate if logged in and hasRegistered is true
                    )
                ) : (
                    <ListLocation />  // Render ListLocation if not registered
                )
            ) : (
                <>
                    <div className="image">
                        {/* Add an image if needed */}
                    </div>
                    <div className="text-box">
                        <p>
                            The smart parking system is an innovative solution designed to address the challenges of urban parking by providing real-time availability and reservation features. This user-friendly platform allows drivers to effortlessly find and book parking spots based on their requirements, ensuring a seamless experience. Parking owners can easily manage their locations, adding and updating their parking slots as needed. Users register with essential details and can view available slots, reserve them, and make payments through a secure split payment system. This project aims to revolutionize the parking experience, creating convenience for drivers while optimizing parking management for owners.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;
