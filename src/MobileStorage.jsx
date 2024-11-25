import React, { createContext, useState, useContext } from "react";

// Create the context
const MobileContext = createContext();

// Create a provider to make it available throughout the app
export function MobileProvider({ children }) {
    const [mobileNumber, setMobileNumber] = useState(null);

    return (
        <MobileContext.Provider value={{ mobileNumber, setMobileNumber }}>
            {children}
        </MobileContext.Provider>
    );
}

// Custom hook to use the context
export function useMobile() {
    return useContext(MobileContext);
}
