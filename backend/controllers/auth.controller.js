import User from "../models/user.model.js";
import { generateTokensAndSetCookie } from "../lib/authenticationToken.js";

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
        console.log("Error in signup: ", error);
        // Respond with a 500 status and the error message to indicate server failure
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    res.send("login page");
}
export const logout = async (req, res) => {
    res.send("logout page");
}