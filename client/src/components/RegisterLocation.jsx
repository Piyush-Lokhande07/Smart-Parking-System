import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameter

const RegisterLocation = () => {
    const { locationId } = useParams(); // Get locationId from URL
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const fetchLocationDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/location/${locationId}`); // Fetch location details based on locationId
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
    const amount =50;

    const handlePayment = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/order", {
                method: "POST",
                body: JSON.stringify({
                    amount:amount*100,
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
                amount, 
                currency,
                "name": "Smart Parking System", 
                "description": "Test Transaction",
                "image": "https://example.com/your_logo",
                "order_id": "order_P2CBmdkhwdGuBu", 
                "handler": async function (response){
                    const body = {
                        ...response,
                    };

                    const validateRes= await fetch("http://localhost:3000/order/validate",
                    {
                        method:"POST",
                        body: JSON.stringify(body),
                        headers:{
                            "Content-Type":"application/json",
                        }

                    });

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
            rzp1.on('payment.failed', function (response){
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
                    <label htmlFor="vehicleNumber">Vehicle Number:</label>
                    <input type="text" id="vehicleNumber" name="vehicleNumber" required />
                    <button className='Payment-btn' type="submit" onClick={handlePayment}>Pay Rs.50 and Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterLocation;
