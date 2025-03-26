import jwt from "jsonwebtoken"; // Import the JSON Web Token library for token handling
import User from "../models/user.model.js"; // Import the User model from your application's models

// Middleware to protect routes by validating the access token and attaching user information to the request object
export const protectRoute = async (req, res, next) => {
    try {
        // Extract the access token from the cookies sent with the HTTP request
        const accessToken = req.cookies.accessToken;

        // If no access token is provided, return a 401 Unauthorized response with an error message
        if (!accessToken) return res.status(401).json({ message: "Unauthorized, No token found" });

        try {
            // Verify the access token's validity using the secret key stored in environment variables
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

            // Retrieve the user's information from the database, excluding the password field
            const user = await User.findById(decoded.userId).select("-password");

            // If no matching user is found, return a 401 Unauthorized response with an error message
            if (!user) return res.status(401).json({ message: "User not found" });

            // Attach the user information to the `req` object for use in subsequent middleware or routes
            req.user = user;

            // Call the next middleware or route handler in the stack
            next();
        } catch (error) {
            // Handle specific JWT errors, such as token expiration
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Access token expired" });
            }
            // Rethrow any unexpected errors to be caught by the outer catch block
            throw error;
        }
    } catch (error) {
        // Log unexpected errors to the console for debugging purposes
        console.log("Error in protectRoute middleware: ", error);

        // Respond with a 500 Internal Server Error status and the error message
        res.status(500).json({ message: error.message });
    }
};

// Middleware to restrict access to admin-only routes
export const adminRoute = async (req, res, next) => {
    try {
        // Check if the user is authenticated and has the role of 'admin'
        if (req.user && req.user.role === "admin") {
            // Proceed to the next middleware or route handler
            next();
        } else {
            // Return a 403 Forbidden response if the user is not an admin
            return res.status(403).json({ message: "Access denied - admin only" });
        }
    } catch (error) {
        // Log unexpected errors to the console for debugging purposes
        console.log("Error in adminRoute middleware: ", error);

        // Respond with a 500 Internal Server Error status and the error message
        res.status(500).json({ message: error.message });
    }
};
