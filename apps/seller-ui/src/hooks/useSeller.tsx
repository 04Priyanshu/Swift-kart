import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { useEffect } from "react";

const fetchSeller = async () => {
    const response = await axiosInstance.get("/api/logged-in-seller");
    return response.data.seller;
}

const useSeller = () => {
    const queryClient = useQueryClient();
    
    const {data: seller, isLoading, isError , refetch} = useQuery({
        queryKey: ["seller"],
        queryFn: fetchSeller,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    })

    // Set up global logout handler with query invalidation
    useEffect(() => {
        const handleGlobalLogout = () => {
            queryClient.invalidateQueries({ queryKey: ["seller"] });
        };

        // Add event listener for logout
        window.addEventListener('logout', handleGlobalLogout);
        
        return () => {
            window.removeEventListener('logout', handleGlobalLogout);
        };
    }, [queryClient]);

    return {seller, isLoading, isError, refetch};
}

export default useSeller;