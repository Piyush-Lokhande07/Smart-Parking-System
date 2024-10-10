import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; 

const Opengate = () => {
    const navigate = useNavigate();
    const { userId } = useContext(AuthContext); 
    console.log("USerID  in Opengate: ",userId);
    const [deadline, setDeadline] = useState(null);


    useEffect(() => {
        if (!userId) {
            navigate('/');
            return;
        }

        const checkRegistration = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/checkRegistration/${userId}`);
                const data = await response.json();
                if (!data.has_registered) {
                    navigate('/'); 
                }
            } catch (error) {
                console.error('Error checking registration status:', error);
                navigate('/');
            }
        };

        checkRegistration();
    }, [userId, navigate]);

    useEffect(() => {
        if (!userId) return; 

        const fetchRegistrationDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/getRegistrationDetails/${userId}`);
                const data = await response.json();

                const registeredTime = new Date(data.registered_time);
                registeredTime.setMinutes(registeredTime.getMinutes() + 30); 

                setDeadline(registeredTime);
            } catch (error) {
                console.error('Error fetching registration details:', error);
            }
        };

        fetchRegistrationDetails();
    }, [userId]);


    const handleOpenBarrier = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/openBarrier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, action: 'entry' }),
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
