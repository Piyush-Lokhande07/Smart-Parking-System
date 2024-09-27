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
                    <button className='Payment-btn' type="submit">Pay Rs.50 and Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterLocation;
