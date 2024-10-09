import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Adjust the path as necessary

const Opengate = () => {
    const navigate = useNavigate();
    const { userId } = useContext(AuthContext); // Get userId from AuthContext
    console.log("USerID  in Opengate: ",userId);
    const [deadline, setDeadline] = useState(null);

    // Check if userId is available
    useEffect(() => {
        if (!userId) {
            navigate('/'); // Redirect if userId is not available
            return;
        }

        const checkRegistration = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/checkRegistration/${userId}`);
                const data = await response.json();
                if (!data.has_registered) {
                    navigate('/'); // Redirect to home if not registered
                }
            } catch (error) {
                console.error('Error checking registration status:', error);
                navigate('/');
            }
        };

        checkRegistration();
    }, [userId, navigate]);

    // Fetch registration details (e.g., registration time) after confirming registration
    useEffect(() => {
        if (!userId) return; // Avoid fetching if userId is not available

        const fetchRegistrationDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/getRegistrationDetails/${userId}`);
                const data = await response.json();

                const registeredTime = new Date(data.registered_time);
                registeredTime.setMinutes(registeredTime.getMinutes() + 30); // Add 30 minutes to registration time

                setDeadline(registeredTime);
            } catch (error) {
                console.error('Error fetching registration details:', error);
            }
        };

        fetchRegistrationDetails();
    }, [userId]);

    // Function to open the barrier for entry
    const handleOpenBarrier = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/openBarrier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, action: 'entry' }), // Send userId and 'entry' action
            });

            if (response.ok) {
                alert('Barrier opened! Entry recorded.');
            } else {
                alert('Failed to open the barrier.');
            }
        } catch (error) {
            console.error('Error opening barrier:', error);
            alert('Error opening barrier.');
        }
    };

    if (!deadline) {
        return <p>Loading...</p>; 
    }

    return (
        <div className='open-div'>
            <h1>Welcome to the Parking Area</h1>
            <p>Your registration will be cancelled after {deadline.toLocaleTimeString()}.</p>
            <button onClick={handleOpenBarrier}>Open Barrier for Entry</button>
        </div>
    );
};

export default Opengate;
