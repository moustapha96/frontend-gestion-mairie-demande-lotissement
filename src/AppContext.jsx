// src/context/AppContext.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [urlApi, setUrlApi] = useState(import.meta.env.VITE_API_URL);
    const [urlBackend, setUrlBackend] = useState(import.meta.env.VITE_API_URL_SERVEUR);
    return (
        <AppContext.Provider value={{ urlApi, setUrlApi, urlBackend }}>
            {children}
        </AppContext.Provider>
    );
};
