import React, { createContext, useState } from 'react';

export const TransportFileContext = createContext();

export const TransportFileProvider = ({ children }) => {
    const [transportFile, setTransportFile] = useState('');

    return (
        <TransportFileContext.Provider value={{ transportFile, setTransportFile }}>
            {children}
        </TransportFileContext.Provider>
    );
};
