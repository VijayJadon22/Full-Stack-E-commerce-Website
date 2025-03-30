// Importing the Axios library to handle HTTP requests
import axios from "axios";

// Creating a reusable Axios instance with predefined configurations
const axiosInstance = axios.create({
    // Setting the base URL for all HTTP requests. This acts as the root endpoint for your API.
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // Enabling the sending of credentials (such as cookies) with cross-origin requests
});

// Exporting the Axios instance so it can be imported and used in other files
export default axiosInstance;
 