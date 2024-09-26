import React, { useState } from "react";

function Login({ onSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                onSuccess("Login Successful"); // Pass message to Navbar
            } else {
                setMessage(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Error during login", error);
            setMessage("Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {message && <div>{message}</div>} {/* Display message */}
            <div>Enter your username:</div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <div>Enter password:</div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className='in-btn' type="submit">Submit</button>
        </form>
    );
}

export default Login;
