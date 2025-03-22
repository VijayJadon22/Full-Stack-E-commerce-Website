import User from "../models/user.model.js";
import { generateTokensAndSetCookie } from "../lib/authenticationToken.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

export const signup = async (req, res) => {
    // Extract email, password, and name from the incoming request body
    const { email, password, name } = req.body;
    try {
        // Check if a user already exists with the provided email
        const user = await User.findOne({ email });
        if (user) {
            // If the user exists, respond with a 400 status and an appropriate message
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user object with the provided email, password, and name
        // The password will be hashed automatically due to the pre-save middleware in the User schema
        const newUser = new User({
            email,
            password, //will be hashed automatically due to the pre-save middleware in the User schema
            name
        });

        // Save the new user to the database
        const newCreatedUser = await newUser.save();

        // Generate access and refresh tokens for the new user and set them in cookies and also in upstash redis
        await generateTokensAndSetCookie(newCreatedUser, res);

        // Respond with a 201 status, the user's basic details (excluding sensitive information like the password), 
        // and a success message
        return res.status(201).json({
            user: {
                _id: newCreatedUser._id, // Send the user's unique ID
                name: newCreatedUser.name, // Send the user's name
                email: newCreatedUser.email, // Send the user's email
                role: newCreatedUser.role, // Send the user's role (admin/customer)
            },
            message: "User created successfully" // Success message
        });
    } catch (error) {
        // Log any unexpected error to the console for debugging purposes
        console.log("Error in signup controller: ", error);
        // Respond with a 500 status and the error message to indicate server failure
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    // Destructure email and password from the request body
    const { email, password } = req.body;
    try {
        // Attempt to find a user in the database with the provided email
        const user = await User.findOne({ email });
        // If no user is found, respond with a 400 status and message
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        await generateTokensAndSetCookie(user, res);// Generate access and refresh tokens for the user and set them in cookies and also store refresh token in redis

        // Respond with a 200 status, the user's basic details (excluding sensitive information like the password),
        return res.status(200).json({
            user: {
                _id: user._id, // Send the user's unique ID
                name: user.name, // Send the user's name
                email: user.email, // Send the user's email
                role: user.role // Send the user's role (admin/customer)
            },
            message: "Logged in successfully" // Success message
        });
    } catch (error) {
        // Log any unexpected error to the console for debugging purposes
        console.log("Error in login controller: ", error);
        // Respond with a 500 status and the error message to indicate server failure
        res.status(500).json({ message: error.message });
    }
}


export const logout = async (req, res) => {
    try {
        // Retrieve the refresh token from the request cookies
        const refreshToken = req.cookies.refreshToken;
        // If a refresh token exists, verify it and delete it from Redis
        if (refreshToken) {
            // Verify the refresh token to get the userId from the refresh token
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            // Delete the refresh token from Redis
            await redis.del(`refresh_token:${decoded.userId}`);
        }

        // Clear both the access and refresh tokens from the request cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        // Respond with a 200 status and a success message
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        // Log any unexpected error to the console for debugging purposes
        console.log("Error in logout controller: ", error);

        // Respond with a 500 status and the error message to indicate server failure
        res.status(500).json({ message: error.message });
    }
}