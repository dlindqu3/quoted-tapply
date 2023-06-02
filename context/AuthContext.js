
'use client';
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext({})

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState("AA");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    )
};

export const useUserContext = () => useContext(UserContext);