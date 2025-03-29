import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js"; 
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js"; // Controller functions to fetch analytics data

const router = express.Router();

// Route to fetch analytics and daily sales data
// This route:
// - Requires authentication via the `protectRoute` middleware
// - Ensures only admin can access this route via the `adminRoute` middleware
router.get("/", protectRoute, adminRoute, async (req, res) => {
    try {
        // Fetch overall analytics data (e.g., total users, products, sales, revenue)
        const analyticsData = await getAnalyticsData();

        // Calculate the date range for daily sales data (last 7 days)
        const endDate = new Date(); // Current date
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Subtract 7 days in milliseconds

        // Fetch daily sales data for the specified date range
        const dailySalesData = await getDailySalesData(startDate, endDate);

        // Respond with a JSON object containing analytics and daily sales data
        res.json({ analyticsData, dailySalesData });
    } catch (error) {
        // Log any errors to the console for debugging purposes
        console.log("Error in analytics routes: ", error.message);
        // Respond with a 500 Internal Server Error status and error message
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Export the router for use in the main application
export default router;
