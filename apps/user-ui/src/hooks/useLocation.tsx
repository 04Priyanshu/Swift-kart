"use client";

import { useEffect, useState } from "react";

const LOCATION_STORAGE_KEY = "user_location";
const LOCATION_EXPIRY_DAYS = 20;

const useLocation = () => {
    const [location, setLocation] = useState<{ country: string; city: string } | null>(null);

    useEffect(() => {
        // Only run on client
        const getStoredLocation = () => {
            const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
            if (!stored) return null;
            const parsedData = JSON.parse(stored);
            const expiryTime = LOCATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
            const isExpired = Date.now() - parsedData.timestamp > expiryTime;
            return isExpired ? null : parsedData.location;
        };

        const storedLocation = getStoredLocation();
        if (storedLocation) {
            setLocation(storedLocation);
            return;
        }

        fetch("http://ip-api.com/json/")
            .then((res) => res.json())
            .then((data) => {
                const newLocation = {
                    country: data.country,
                    city: data.city,
                    timestamp: Date.now(),
                };
                localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(newLocation));
                setLocation({ country: data.country, city: data.city });
            })
            .catch((err) => {
                console.error("Error fetching location:", err);
            });
    }, []);

    return location;
};

export default useLocation;