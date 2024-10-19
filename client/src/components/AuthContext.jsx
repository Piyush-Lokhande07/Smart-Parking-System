import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [userId, setUserId] = useState(null); 
    const [hasRegistered, setHasRegistered] = useState(false); // New state for registration status
    const [isInside, setIsInside] = useState(false); // New state for entry status

    const login = (id) => {
        setIsLoggedIn(true);
        setUserId(id); 
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserId(null); 
        setHasRegistered(false); // Reset registration status on logout
        setIsInside(false); // Reset entry status on logout
    };

    return (
        <AuthContext.Provider value={{ 
            isLoggedIn, 
            userId, 
            hasRegistered, 
            setHasRegistered, 
            isInside,
            setIsInside, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
