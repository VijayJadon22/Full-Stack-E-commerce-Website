// Import necessary models
import Order from "../models/order.model.js"; // Order model to retrieve order-related data
import Product from "../models/product.model.js"; // Product model to retrieve product-related data
import User from "../models/user.model.js"; // User model to retrieve user-related data

// Function to get overall analytics data
export const getAnalyticsData = async () => {
    // Get the total number of users in the database
    const totalUsers = await User.countDocuments();

    // Get the total number of products in the database
    const totalProducts = await Product.countDocuments();

    // Aggregate sales data from the Order collection
    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null, // No specific grouping criteria, aggregate over all documents
                totalSales: { $sum: 1 }, // Count the total number of orders
                totalRevenue: { $sum: '$totalAmount' }, // Calculate the total revenue by summing `totalAmount`
            }
        }
    ]);

    // Extract totalSales and totalRevenue from the aggregation result
    // If no sales data exists, default to 0 for both sales and revenue
    const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

    // Return a summary object containing analytics data
    return {
        users: totalUsers, // Total number of users
        products: totalProducts, // Total number of products
        totalSales, // Total number of orders
        totalRevenue, // Total revenue from sales
    };
};

// Function to get daily sales data for a specified date range
export const getDailySalesData = async (startDate, endDate) => {
    try {
        // Aggregate daily sales data from the Order collection
        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    // Filter orders by the specified date range (inclusive)
                    createdAt: {
                        $gte: startDate, // Start date (greater than or equal to)
                        $lte: endDate, // End date (less than or equal to)
                    },
                },
            },
            {
                $group: {
                    // Group by day (formatted as "YYYY-MM-DD")
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: 1 }, // Count the total number of sales for each day
                    revenue: { $sum: "$totalAmount" }, // Sum the revenue for each day
                },
            },
            {
                $sort: { _id: 1 }, // Sort the results by date in ascending order
            },
        ]);

        // Example of `dailySalesData` structure:
        // [
        //     {
        //         _id: "2024-08-18",
        //         sales: 12,
        //         revenue: 1450.75
        //     },
        // ]

        // Generate an array of all dates between `startDate` and `endDate`
        const dateArray = getDatesInRange(startDate, endDate);
        // Example output of `dateArray`:
        // ['2024-08-18', '2024-08-19', ...]

        // Map the `dateArray` to ensure every date has data
        return dateArray.map((date) => {
            // Check if sales data exists for the current date
            const foundData = dailySalesData.find((item) => item._id === date);

            // Return the date with sales and revenue (default to 0 if no data is found)
            return {
                date, // Current date in "YYYY-MM-DD" format
                sales: foundData?.sales || 0, // Sales count for the date (default to 0)
                revenue: foundData?.revenue || 0, // Revenue for the date (default to 0)
            };
        });
    } catch (error) {
        // Propagate the error to the caller function
        throw error;
    }
};
