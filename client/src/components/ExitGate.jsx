import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ExitGate = () => {
    const navigate = useNavigate();
    const { isInside, setIsInside, userId, setHasRegistered } = useContext(AuthContext);  // Add userId and setHasRegistered

    const handleOpenBarrier = async (e) => {
        e.preventDefault();
    
        try {
            // Send the close gate timing (exit time) to the backend and get the total amount for payment
            const closeGateResponse = await fetch("http://localhost:3000/api/closeGate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                }),
            });
    
            if (!closeGateResponse.ok) {
                const errorData = await closeGateResponse.json();
                throw new Error(errorData.message || 'Failed to record exit');
            }
    
            const { totalAmount } = await closeGateResponse.json(); // Get the total amount from the backend
    
            // Now, create the payment order by hitting the /order endpoint
            const orderResponse = await fetch("http://localhost:3000/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: totalAmount * 100, // Amount in paisa
                    currency: "INR",
                }),
            });
    
            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.message || 'Failed to create payment order');
            }
    
            const order = await orderResponse.json(); // Get order details
    
            // Configure Razorpay options for the payment
            var options = {
                "key": process.env.KEY_ID,
                amount: totalAmount * 100, // Amount in paisa
                currency: "INR",
                "name": "Smart Parking System",
                "description": "Parking Payment",
                "order_id": order.id, // Use the order ID from Razorpay
                "handler": async function (response) {
                    const body = { ...response };
    
                    // Validate the payment by hitting the /order/validate endpoint
                    const validateRes = await fetch("http://localhost:3000/order/validate", {
                        method: "POST",
                        body: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
    
                    if (validateRes.ok) {
                        // Once payment is successful, open the gate for exit
                        const entryTimeResponse = await fetch("http://localhost:3000/api/openExitGate", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ userId }),
                        });
    
                        if (entryTimeResponse.ok) {
                            alert('Payment successful! Gate opened for exit.');
                            // setIsInside(false);  // Reset the inside state
                            setHasRegistered(false);  
                            console.log("setHasRegistered in p: ",setHasRegistered);
                            navigate('/home');
                        } else {
                            alert('Failed to open the exit gate.'); 
                        }
                    } else {
                        alert('Payment validation failed.'); 
                    }
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
    

    return (
        <div className='exit-gate-container'>
            <h2>Open Barrier for Exit</h2>
            <button className="exit-btn" onClick={handleOpenBarrier}>Open Barrier for Exit</button>
        </div>
    );
};

export default ExitGate;
