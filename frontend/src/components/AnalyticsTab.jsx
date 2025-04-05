import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Framer Motion for animations
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react"; // Icon components for visual representation
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // Recharts components for rendering charts
import axios from "../lib/axios"; // Axios instance for API requests

// AnalyticsTab: Main component to display analytics data and charts
const AnalyticsTab = () => {
  // State to store overall analytics data (total users, products, sales, and revenue)
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  // State to track if data is still being loaded
  const [isLoading, setIsLoading] = useState(true);

  // State to store daily sales data for the line chart visualization
  const [dailySalesData, setDailySalesData] = useState([]);

  // useEffect: Fetch analytics data when the component is mounted
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Make an API call to fetch analytics data from the backend
        const response = await axios.get("/analytics");

        // Update state with the received data
        setAnalyticsData(response.data.analyticsData); // Set summary data (e.g., total users, products)
        setDailySalesData(response.data.dailySalesData); // Set daily sales data for the chart
      } catch (error) {
        // Log any errors during the API request to the console for debugging
        console.error("Error fetching analytics data:", error);
      } finally {
        // Ensure loading state is updated to false, regardless of success or failure
        setIsLoading(false);
      }
    };

    // Call the function to fetch data
    fetchAnalyticsData();
  }, []); // Empty dependency array ensures this effect runs only on initial render

  // Render a loading indicator if the data is still being fetched
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render the analytics dashboard once data is loaded
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Grid for displaying data cards (users, products, sales, revenue) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* AnalyticsCard: Reusable card component to display each metric */}
        <AnalyticsCard
          title="Total Users" // Card title
          value={analyticsData.users.toLocaleString()} // Format users with commas
          icon={Users} // Icon representing users
          color="from-emerald-500 to-teal-700" // Gradient color for background
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package} // Icon for products
          color="from-emerald-500 to-green-700"
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart} // Icon for sales
          color="from-emerald-500 to-cyan-700"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`₹ ${analyticsData.totalRevenue.toLocaleString()}`} // Format revenue with currency
          icon={DollarSign} // Icon for revenue
          color="from-emerald-500 to-lime-700"
        />
      </div>

      {/* Animated container for the line chart */}
      <motion.div
        className="bg-gray-800 rounded-lg p-4 shadow-lg"
        initial={{ opacity: 0, y: 20 }} // Starting state for animation
        animate={{ opacity: 1, y: 0 }} // Target state for animation
        transition={{ duration: 0.5, delay: 0.25 }} // Smooth animation with delay
      >
        {/* Responsive container for the chart */}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
            {" "}
            {/* Line chart with data */}
            <CartesianGrid strokeDasharray="3 3" /> {/* Gridlines for chart */}
            <XAxis dataKey="name" stroke="#D1D5DB" />{" "}
            {/* X-axis showing day names */}
            <YAxis yAxisId="left" stroke="#D1D5DB" />{" "}
            {/* Left Y-axis for sales data */}
            <YAxis yAxisId="right" orientation="right" stroke="#D1D5DB" />{" "}
            {/* Right Y-axis for revenue */}
            <Tooltip /> {/* Tooltip for displaying values on hover */}
            <Legend /> {/* Legend for identifying lines */}
            <Line
              yAxisId="left"
              type="monotone" // Smooth curve for line
              dataKey="sales" // Data field for sales
              stroke="#10B981" // Green color for sales line
              activeDot={{ r: 8 }} // Highlighted dot on hover
              name="Sales" // Legend name
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue" // Data field for revenue
              stroke="#3B82F6" // Blue color for revenue line
              activeDot={{ r: 8 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};
export default AnalyticsTab; // Export the AnalyticsTab component

// AnalyticsCard: Reusable component for displaying data summary cards
const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className={`bg-gray-800 rounded-lg py-2 px-4 shadow-lg overflow-hidden relative ${color}`} // Styling for card with gradient background
    initial={{ opacity: 0, y: 20 }} // Starting animation state
    animate={{ opacity: 1, y: 0 }} // Target animation state
    transition={{ duration: 0.5 }} // Smooth animation transition
  >
    <div className="flex justify-between items-center">
      <div className="z-10">
        <p className="text-emerald-300 text-sm mb-1 font-semibold">{title}</p>{" "}
        {/* Display card title */}
        <h3 className="text-white text-xl font-bold">{value}</h3>{" "}
        {/* Display card value */}
      </div>
    </div>
    {/* Background gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30" />
    {/* Icon for card (e.g., Users, Products) */}
    <div className="absolute -bottom-4 -right-4 text-emerald-800 opacity-50">
      <Icon className="h-32 w-32" /> {/* Icon size */}
    </div>
  </motion.div>
);
