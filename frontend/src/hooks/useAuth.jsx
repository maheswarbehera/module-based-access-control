import { useState, useEffect } from "react";

import api from "../config";

const useAuth = () => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get("/auth"); 
                setUser(data.user);
            } catch (error) {
                console.error("Error fetching user", error);
            }
        };
        fetchUser();
    }, []);
    
    return user;
};
export default useAuth;