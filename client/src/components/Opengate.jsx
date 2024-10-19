import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Opengate = () => {
    const [timeLeft, setTimeLeft] = useState(10800); // 3 hours in seconds
    const navigate = useNavigate();
    const { userId, setIsInside } = useContext(AuthContext); // Access userId and setIsInside from AuthContext

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleOpenGate = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/checkPresence`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.isPresent) {
                    // Vehicle is detected, proceed to open gate
                    setIsInside(true); // Set isInside to true
                    const entryTimeResponse = await fetch(`http://localhost:3000/api/openGateEntry`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId }),
                    });

                    if (entryTimeResponse.ok) {
                        alert('Gate opened successfully!');
                        navigate('/home');
                    } else {
                        alert('Failed to log entry time.');
                    }
                } else {
                    alert('Vehicle not detected at the barrier.');
                }
            } else {
                alert('Error checking vehicle presence.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred.');
        }
    };

    return (
        <div className='open-gate-container'>
            <div className='open-gate-box'>
                <h2>Open Gate for Entry</h2>
                <p>Your registration will be cancelled after: {Math.floor(timeLeft / 3600)}:{('0' + Math.floor((timeLeft % 3600) / 60)).slice(-2)}:{('0' + (timeLeft % 60)).slice(-2)}</p>
                <button className='entry-btn' onClick={handleOpenGate} disabled={timeLeft <= 0}>Open Gate</button>
            </div>
        </div>
    );
};

export default Opengate;
