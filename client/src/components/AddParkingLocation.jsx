import React, { useState } from 'react';

function AddParkingLocation() {
    const [locationName, setLocationName] = useState('');
    const [completeAddress, setCompleteAddress] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [googleMapUrl, setGoogleMapUrl] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [panNumber, setPanNumber] = useState(''); // Added PAN number state
    const [ifscCode, setIfscCode] = useState('');
    const [branchName, setBranchName] = useState('');
    const [availableSlots, setAvailableSlots] = useState('');
    const [popupMessage, setPopupMessage] = useState(""); 
    const [isPopupOpen, setIsPopupOpen] = useState(false); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform basic validation before sending request
        if (!locationName || !completeAddress || !pinCode || !googleMapUrl || !accountHolderName || !accountNumber || !panNumber || !ifscCode || !branchName || !availableSlots) {
            setPopupMessage('Error: All fields are required.');
            setIsPopupOpen(true);
            setTimeout(() => setIsPopupOpen(false), 3000);
            return;
        }

        const parkingData = {
            locationName,
            completeAddress,
            pinCode,
            googleMapUrl,
            accountHolderName,
            accountNumber,
            panNumber, 
            ifscCode,
            branchName,
            availableSlots: parseInt(availableSlots), 
        };

        try {
            const response = await fetch('http://localhost:3000/api/add-parking-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parkingData),
            });
            

            if (response.ok) {
                const result = await response.json();
                setPopupMessage(result.message); 
                setIsPopupOpen(true); 
                // Clear form fields
                setLocationName('');
                setCompleteAddress('');
                setPinCode('');
                setGoogleMapUrl('');
                setAccountHolderName('');
                setAccountNumber('');
                setPanNumber(''); 
                setIfscCode('');
                setBranchName('');
                setAvailableSlots('');
                setTimeout(() => setIsPopupOpen(false), 3000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add parking location');
            }
        } catch (error) {
            console.error('Error adding parking location:', error);
            setPopupMessage('Error: Unable to add parking location.');
            setIsPopupOpen(true);
            setTimeout(() => setIsPopupOpen(false), 3000); 
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Add Parking Location</h2>
                <h3>Location Details</h3>
                <input type="text" placeholder="Location Name" value={locationName} onChange={(e) => setLocationName(e.target.value)} required />
                <input type="text" placeholder="Complete Address" value={completeAddress} onChange={(e) => setCompleteAddress(e.target.value)} required />
                <input type="text" placeholder="Pin Code" value={pinCode} onChange={(e) => setPinCode(e.target.value)} required />
                <input type="url" placeholder="Google Maps URL" value={googleMapUrl} onChange={(e) => setGoogleMapUrl(e.target.value)} required />

                <h3>Bank Details</h3>
                <input type="text" placeholder="Account Holder Name" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} required />
                <input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
                <input type="text" placeholder="PAN Number" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} required />
                <input type="text" placeholder="IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} required />
                <input type="text" placeholder="Branch Name" value={branchName} onChange={(e) => setBranchName(e.target.value)} required />

                <h3>Slot Details</h3>
                <input type="number" placeholder="Number of Available Slots" value={availableSlots} onChange={(e) => setAvailableSlots(e.target.value)} required min="1" />

                <button type="submit">Submit</button>
            </form>

            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={() => setIsPopupOpen(false)}>&times;</span>
                        <div>{popupMessage}</div> 
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddParkingLocation;
