import { redis } from "./redis.js";

export const generateTokensAndSetCookie = async (user, res) => {
    // Generates access and refresh tokens for the given user
    // The tokens are generated using a method defined on the user object in userSchema
    const { accessToken, refreshToken } = user.generateTokens(user._id);

    // Stores the refresh token in Redis with an expiration time for session persistence
    await storeRefreshToken(user._id, refreshToken);

    // Sets the access token in an HTTP-only cookie with a 15-minute expiration
    // HTTP-only ensures the cookie cannot be accessed by client-side scripts
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // Increases security by preventing access from JavaScript
        secure: process.env.NODE_ENV === "production", // Ensures cookies are only sent over HTTPS in production
        sameSite: "strict", // Prevents the cookie from being sent with cross-site requests
        maxAge: 15 * 60 * 1000, // Cookie expires after 15 minutes (in milliseconds)
    });

    // Sets the refresh token in an HTTP-only cookie with a 7-day expiration
    // Used to obtain new access tokens when the current one expires
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === "production", // HTTPS enforcement in production
        sameSite: "strict", // Restricts the cookie to same-site requests
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires after 7 days (in milliseconds)
    });
};

const storeRefreshToken = async (userId, refreshToken) => {
    try {
        // Stores the refresh token in the Redis database
        // The key is prefixed with "refresh_token:" followed by the user ID for uniqueness
        // The token is set to expire after 7 days (in seconds)
        await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
    } catch (error) {
        // Logs an error message if storing the refresh token fails
        console.error(`Failed to store refresh token for user ${userId}:`, error);
        // Throws an error to indicate failure during token storage
        throw new Error("Could not store refresh token");
    }
};
