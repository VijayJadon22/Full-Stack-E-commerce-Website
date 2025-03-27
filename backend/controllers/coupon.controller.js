import Coupon from "../models/coupon.model.js";

// Controller function to retrieve an active coupon for the logged-in user
export const getCoupon = async (req, res) => {
    try {
        // Find a coupon in the database that matches the current user's ID and is marked as active
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
        // If a coupon is found, return it; otherwise, return null
        res.json(coupon || null);
    } catch (error) {
        // Log any unexpected errors to the console for debugging purposes
        console.log("Error in getCoupon controller: ", error);
        // Respond with a 500 Internal Server Error and the error message
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Controller function to validate a coupon code provided by the user
export const validateCoupon = async (req, res) => {
    try {
        // Extract the coupon code from the request body
        const { code } = req.body;

        // Find a coupon in the database that matches the provided code, belongs to the current user, and is active
        const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

        // If no matching coupon is found, return a 404 Not Found response
        if (!coupon) return res.status(404).json({ message: "Coupon not found" });

        // Check if the coupon has expired by comparing its expirationDate with the current date
        if (coupon.expirationDate < new Date()) {
            // If the coupon has expired, mark it as inactive and save the updated coupon to the database
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({ message: "Coupon expired" });
        }

        // If the coupon is valid, return a success response with its details
        res.json({
            message: "Coupon is valid",
            discountPercentage: coupon.discountPercentage, // Include the discount percentage
            code: coupon.code // Include the coupon code
        });
    } catch (error) {
        // Log any unexpected errors to the console for debugging purposes
        console.log("Error in validateCoupon controller: ", error);
        // Respond with a 500 Internal Server Error and the error message
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
