import React, { createContext, useContext, useState } from 'react';

const DonateContext = createContext();

export const useDonate = () => {
    const context = useContext(DonateContext);
    if (!context) {
        throw new Error('useDonate must be used within a DonateProvider');
    }
    return context;
};

export const DonateProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [initialData, setInitialData] = useState(null);

    const openDonate = (data = {}) => {
        setInitialData(data);
        setIsOpen(true);
    };

    const closeDonate = () => {
        setIsOpen(false);
        setInitialData(null);
    };

    return (
        <DonateContext.Provider value={{ isOpen, initialData, openDonate, closeDonate }}>
            {children}
        </DonateContext.Provider>
    );
};
