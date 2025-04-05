import React, { useEffect, useState } from "react"; // React core functionality and hooks
import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react"; // Icons for tabs
import { motion } from "framer-motion"; // Framer Motion for animations
import ProductsList from "../components/ProductsList.jsx"; // Component for displaying product list
import AnalyticsTab from "../components/AnalyticsTab.jsx"; // Component for displaying analytics data
import CreateProductForm from "../components/CreateProductForm.jsx"; // Component for creating products
import { useProductStore } from "../stores/useProductStore.js"; // Zustand store for managing products

// Define the tab structure with icons and labels
const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle }, // Create Product tab
  { id: "products", label: "Products", icon: ShoppingBasket }, // Products tab
  { id: "analytics", label: "Analytics", icon: BarChart }, // Analytics tab
];

// AdminPage Component: The main dashboard page for administrators
const AdminPage = () => {
  // State to track the currently active tab
  const [activeTab, setActiveTab] = useState("create");

  // Zustand store action to fetch all products
  const { fetchAllProducts } = useProductStore();

  // Fetch products when the component mounts
  useEffect(() => {
    fetchAllProducts(); // Call the function to fetch products
  }, [fetchAllProducts]);

  // Render the admin page UI
  return (
    <div className="relative min-h-screen overflow-hidden">
      {" "}
      {/* Page container */}
      <div className="relative z-10 container mx-auto px-4 pt-1 pb-4">
        {" "}
        {/* Inner container */}
        {/* Animated page title */}
        <motion.h1
          className="text-3xl font-bold mb-4 text-center text-gray-600"
          initial={{ opacity: 0, y: -20 }} // Initial animation state: fade in and slide down
          animate={{ opacity: 1, y: 0 }} // Final animation state: fully visible at original position
          transition={{ duration: 0.8 }} // Smooth animation over 0.8 seconds
        >
          Admin Dashboard {/* Page header */}
        </motion.h1>
        {/* Tab navigation */}
        <div className="flex justify-center mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id} // Unique key for each tab
              onClick={() => setActiveTab(tab.id)} // Set the active tab when clicked
              className={`flex items-center px-2 py-2 mx-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white" // Active tab styling
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600" // Inactive tab styling with hover effect
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5 hidden sm:inline" />{" "}
              {/* Tab icon (hidden on small screens) */}
              {tab.label} {/* Tab label */}
            </button>
          ))}
        </div>
        {/* Conditionally render components based on the active tab */}
        {activeTab === "create" && <CreateProductForm />}{" "}
        {/* Render CreateProductForm when "create" tab is active */}
        {activeTab === "products" && <ProductsList />}{" "}
        {/* Render ProductsList when "products" tab is active */}
        {activeTab === "analytics" && <AnalyticsTab />}{" "}
        {/* Render AnalyticsTab when "analytics" tab is active */}
      </div>
    </div>
  );
};

// Export the AdminPage component for use elsewhere
export default AdminPage;
