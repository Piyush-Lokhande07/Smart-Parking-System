import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const RegisterLocation = () => {
    const { locationId } = useParams();
    const navigate = useNavigate();
    const { userId } = useContext(AuthContext);

    console.log('User ID in RegisterLocation:', userId);
    const [location, setLocation] = useState(null);
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [timeWindow, setTimeWindow] = useState('');

    useEffect(() => {
        const fetchLocationDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/location/${locationId}`);
                const data = await response.json();
                setLocation(data);
            } catch (error) {
                console.error('Error fetching location details:', error);
            }
        };

        fetchLocationDetails();
    }, [locationId]);

    if (!location) {
        return <p>Loading location details...</p>;
    }

    const currency = "INR";
    const amount = 50;

    const handlePayment = async (e) => {
        e.preventDefault();

        if (vehicleNumber.trim() === '' || timeWindow.trim() === '') {
            alert("Please fill in both the time window and vehicle number.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/order", {
                method: "POST",
                body: JSON.stringify({
                    amount: amount * 100,
                    currency,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const order = await response.json();
            console.log(order);

            var options = {
                "key": "rzp_test_TBBRXgPa4yzuqK",
                amount: amount * 100, 
                currency,
                "name": "Smart Parking System",
                "description": "Test Transaction",
                "image": "https://example.com/your_logo",
                "order_id": order.id,
                "handler": async function (response) {
                    const body = {
                        ...response,
                    };

                    const validateRes = await fetch("http://localhost:3000/order/validate", {
                        method: "POST",
                        body: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (validateRes.ok) {
                        const registeredTime = new Date().toISOString(); 

                        console.log('User ID before registration:', userId);

                        await fetch(`http://localhost:3000/api/registerinfo`, {
                            method: "POST",
                            body: JSON.stringify({
                                userId: userId,
                                locationId: locationId,
                                vehicleNumber: vehicleNumber,
                                registeredTime: registeredTime, 
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });

                        alert('Payment successful and registration complete!');
                        navigate(`/open-gate/${locationId}`, { state: { userId } });
                    }
                },
                "prefill": {
                    "name": "Piyush Lokhande",
                    "email": "gaurav.kumar@example.com",
                    "contact": "9000090000"
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                }
            };

            var rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert(response.error.code);
                alert(response.error.description);
                alert(response.error.source);
                alert(response.error.step);
                alert(response.error.reason);
                alert(response.error.metadata.order_id);
                alert(response.error.metadata.payment_id);
            });
            rzp1.open();
        } catch (error) {
            console.error("Payment error:", error.message);
            alert(`Payment error: ${error.message}`);
        }
    };

    const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const getMaxTime = () => {
        const now = new Date();
        now.setHours(now.getHours() + 3);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className='reg-location-con'>
            <div className='register-location'>
                <div className='slot-info'>
                    <div style={{ textAlign: 'center' }}>Available Slots</div>
                    <div className='slot-num'>{location.available_slots}</div>
                </div>
                <h2>Register for Parking at {location.location_name}</h2>
                <p>Complete Address: {location.complete_address}</p>
                <p>Google Map URL: <a href={location.google_map_url} target="_blank" rel="noopener noreferrer">View on Map</a></p>
                
                <form>
                    <label htmlFor="timeWindow">Time Window (3 hours advance):</label>
                    <input
                        type="time"
                        id="timeWindow"
                        name="timeWindow"
                        value={timeWindow}
                        onChange={(e) => {
                            const selectedTime = e.target.value;
                            const maxTime = getMaxTime();
                            if (selectedTime <= maxTime) {
                                setTimeWindow(selectedTime);
                            } else {
                                alert('You can only select a time within 3 hours from now.');
                            }
                        }}
                        required
                        min={getCurrentTime()}
                        max={getMaxTime()}
                    />

                    <label htmlFor="vehicleNumber">Vehicle Number:</label>
                    <input
                        type="text"
                        id="vehicleNumber"
                        name="vehicleNumber"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        required
                    />

                    <button className='Payment-btn' type="submit" onClick={handlePayment}>Pay Rs.50 and Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterLocation;
