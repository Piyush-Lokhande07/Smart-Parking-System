import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [userId, setUserId] = useState(null); 

    const login = (id) => {
        setIsLoggedIn(true);
        setUserId(id); 
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserId(null); 
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
