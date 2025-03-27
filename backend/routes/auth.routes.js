import express from "express";

// Import authentication controller functions from the auth.controller.js file
// These functions handle the logic for signup, login, logout, and token refreshing
import { signup, login, logout, refreshToken } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup); // Route to handle user signup requests
router.post("/login", login); // Route to handle user login requests
router.post("/logout", logout); // Route to handle user logout requests

// Route to handle refresh token requests
// This route provides a new access token if a valid refresh token is sent, by calling the 'refreshToken' controller function
router.post("/refresh-token", refreshToken);

// Route to handle user profile requests (commented out for now)
// If uncommented, it would call a 'getProfile' controller function to retrieve user profile information
// router.get("/profile", getProfile);

// Export the router so it can be used in other parts of the application
export default router;
