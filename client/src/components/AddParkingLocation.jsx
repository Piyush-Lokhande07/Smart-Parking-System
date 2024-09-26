import React from 'react';

function AddParkingLocation(){
    return(
        <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Owner's Name" required />
        <input type="text" placeholder="Bank Account Number" required />
        <input type="text" placeholder="IFSC Code" required />
        <input type="text" placeholder="Branch Name" required />
        <select required>
            <option value="">Select Account Type</option>
            <option value="savings">Savings</option>
            <option value="current">Current</option>
        </select>
        <input type="email" placeholder="Contact Email" required />
        <input type="text" placeholder="Parking Address" required />
        <input type="text" placeholder="Pin Code" required />
        <input type="number" placeholder="Number of Available Slots" required min="1" />
        <input type="url" placeholder="Google Maps Link" required />
        <button type="submit">Submit</button>
    </form>
    


    )
}
export default AddParkingLocation;
