import React, { useState } from "react";

function SignUp({ onSuccess }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/auth/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, phone, email, username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                onSuccess("Registered Successfully", false); 
            } else {
                setMessage(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error during registration", error);
            setMessage("Registration failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>Enter your name:</div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <div>Enter your phone no:</div>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <div>Enter your email-id:</div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div>Enter Username:</div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <div>Enter password:</div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className='in-btn' type="submit">Submit</button>
            {message && <div>{message}</div>}
        </form>
    );
}

export default SignUp;
