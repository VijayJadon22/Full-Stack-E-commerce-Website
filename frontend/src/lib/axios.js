// Importing the Axios library to handle HTTP requests
import axios from "axios";

// Creating a reusable Axios instance with predefined configurations
const axiosInstance = axios.create({
    // Dynamically setting the base URL depending on the environment:
    // If the app is in development mode, use "http://localhost:5000/api" as the base URL.
    // If in production mode, use "/api" (assuming the API is served from the same domain).
    baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
    withCredentials: true, // Enabling the sending of credentials (such as cookies) with cross-origin requests
});

// Exporting the Axios instance so it can be imported and used in other files
export default axiosInstance;
