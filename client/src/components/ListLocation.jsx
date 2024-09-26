import React, { useEffect, useState } from 'react';

const ListLocation = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/get-verified-locations'); // Corrected URL
                const data = await response.json();
                setLocations(data); // No need to filter again since backend already returns verified locations
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchLocations();
    }, []);

    return (
        <div className='big-container'>
            <h2>Parking Locations</h2>
            {locations.length === 0 ? ( // Show message if no locations are found
                <p>No verified locations available.</p>
            ) : (
                locations.map((location) => (
                    <div className='card-container'>
                        <div key={location.id} className="card">
                            <h3 className='loc-name'>{location.location_name}</h3>
                            <div className='down-op'>
                                <a href={location.google_map_url} target="_blank" rel="noopener noreferrer">View on Map</a>
                                <button className='register-btn'>Register</button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ListLocation;
