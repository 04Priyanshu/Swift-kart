import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosinstance";
import { useEffect } from "react";

const fetchUser = async () => {
    const response = await axiosInstance.get("/api/logged-in-user");
    return response.data.user;
}

const useUser = () => {
    const queryClient = useQueryClient();
    
    const {data: user, isLoading, isError , refetch} = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    })

    // Set up global logout handler with query invalidation
    useEffect(() => {
        const handleGlobalLogout = () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        };

        // Add event listener for logout
        window.addEventListener('logout', handleGlobalLogout);
        
        return () => {
            window.removeEventListener('logout', handleGlobalLogout);
        };
    }, [queryClient]);

    return {user, isLoading, isError, refetch};
}

export default useUser;