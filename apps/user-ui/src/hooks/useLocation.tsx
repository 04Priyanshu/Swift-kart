"use client";

import { useEffect, useState } from "react";

const LOCATION_STORAGE_KEY = "user_location";
const LOCATION_EXPIRY_DAYS = 20;

const getStoredLocation = () => {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    if(!stored) return null;
    const parsedData = JSON.parse(stored);
    const expiryTime = LOCATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    const isExpired = Date.now() - parsedData.timestamp > expiryTime;
    
    return isExpired ? null : parsedData.location;
}

const useLocation = () => {
    const [location,setLocation] = useState<{country:string,city:string} | null>(getStoredLocation());

    useEffect(()=>{
        if(location) return;

        fetch("http://ip-api.com/json/")
        .then(res=>res.json())
        .then(data=>{
            const newLocation = {
                country:data.country,
                city:data.city,
                timestamp:Date.now(),
            }
            localStorage.setItem(LOCATION_STORAGE_KEY,JSON.stringify(newLocation));
            setLocation(newLocation);
        })
        .catch(err=>{
            console.error("Error fetching location:",err);
        })
    },[location]);

    return location;

   
}

export default useLocation;