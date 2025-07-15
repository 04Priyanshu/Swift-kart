import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

// Global logout function that can be called from anywhere
export const logout = () => {
    // Clear any stored user data
    if (typeof window !== 'undefined') {
        // Clear any localStorage/sessionStorage if needed
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        
        // Dispatch logout event to invalidate queries
        window.dispatchEvent(new Event('logout'));
        
        // Redirect to login page
        if(window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
    }
}

//handle logout and prevent multiple refresh requests
const handleLogout = () => {
    logout();
}

//handle refresh token
const subscribeToRefreshToken = (callback: () => void) => {
    refreshSubscribers.push(callback);
}

//excecute queued requests after refresh
const onRefreshSuccess = () => {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = [];
}

//handle API requests
axiosInstance.interceptors.request.use( 
    (config) => config,
    (error) => Promise.reject(error)
);

//handle expired token and refresh token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
       

        //prevent multiple refresh requests
        if(error.response.status === 401 && !originalRequest._retry) {
            if(isRefreshing) {
                return new Promise((resolve) => {
                    subscribeToRefreshToken(() => resolve(axiosInstance(originalRequest)));
                });
            }
            isRefreshing = true;
           originalRequest._retry = true;
           try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/refresh-token`,
                {},
                {
                    withCredentials: true,
                }
            );

            isRefreshing = false;
            onRefreshSuccess();

            return axiosInstance(originalRequest);
           } catch (error) {
            isRefreshing = false;
            refreshSubscribers = [];
            handleLogout();
            return Promise.reject(error);
           }
        }
        return Promise.reject(error);
    }
)
export default axiosInstance;