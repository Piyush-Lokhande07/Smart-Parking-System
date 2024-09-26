import React, { useEffect, useState } from 'react';

const ListLocation = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/parking-locations'); // Adjust this URL as per your backend
                const data = await response.json();
                setLocations(data.filter(location => location.verified)); // Filter only verified locations
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchLocations();
    }, []);

    return (
        <div>
            <h2>Verified Parking Locations</h2>
            {locations.map((location) => (
                <div key={location.id} className="card">
                    <h3>{location.location_name}</h3>
                    <a href={location.google_map_url} target="_blank" rel="noopener noreferrer">View on Map</a>
                    <button className='register-btn'>Register</button>
                </div>
            ))}
        </div>
    );
};

export default ListLocation;
