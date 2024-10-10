import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from './AuthContext'; 

const ListLocation = () => {
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate(); 
    const { userId } = useContext(AuthContext); 
    console.log("Userid in ListLocation: ",userId);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/get-verified-locations');
                const data = await response.json();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchLocations();
    }, []);

    const handleRegister = (locationId) => {
        navigate(`/register-location/${locationId}`, { state: { userId } }); 
    };

    return (
        <div className='big-container'>
            <h2>Parking Locations</h2>
            {locations.length === 0 ? (
                <p>No verified locations available.</p>
            ) : (
                locations.map((location) => (
                    <div className='card-container' key={location.id}>
                        <div className="card">
                            <h3 className='loc-name'>
                                {location.location_name} - {location.available_slots} slots available
                            </h3>
                            <div className='down-op'>
                                <a href={location.google_map_url} target="_blank" rel="noopener noreferrer">View on Map</a>
                                <button className='register-btn' onClick={() => handleRegister(location.id)}>Register</button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ListLocation;
