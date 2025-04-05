import React, { useEffect } from "react"; // React core functionality and hooks
import { useProductStore } from "../stores/useProductStore"; // Zustand store for managing product data
import { useParams } from "react-router-dom"; // React Router hook to retrieve route parameters
import { motion } from "framer-motion"; // Framer Motion for adding animations
import ProductCard from "../components/ProductCard.jsx"; // Component to display individual products
import LoadingSpinner from "../components/LaodingSpinner.jsx";

// CategoryPage Component: Displays products belonging to a specific category
const CategoryPage = () => {
  // Retrieve the category parameter from the URL (e.g., /category/:category)
  const { category } = useParams();

  // Zustand store hooks for product management
  const { products, fetchProductsByCategory,loading } = useProductStore();

  // Fetch products of the specified category when the component mounts or when the category changes
  useEffect(() => {
    fetchProductsByCategory(category); // Call the action to fetch products for the given category
  }, [fetchProductsByCategory, category]); // Dependency array ensures the effect runs whenever `fetchProductsByCategory` or `category` changes

  if (loading) {
    return (
      <LoadingSpinner/>
    )
  }

  // Render the category page UI
  return (
    <div className="min-hscreen">
      {" "}
      {/* Ensure minimum height for the page */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {" "}
        {/* Centered and responsive container */}
        {/* Animated page title */}
        <motion.h1
          className="text-center text-4xl font-bold text-gray-600 mb-8" // Styling for the category title
          initial={{ opacity: 0, y: -20 }} // Initial animation state: fade in and slide down
          animate={{ opacity: 1, y: 0 }} // Final animation state: fully visible at original position
          transition={{ duration: 0.8 }} // Smooth animation duration
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
          {/* Capitalize the first letter of the category */}
        </motion.h1>
        {/* Animated product grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 justify-items-center" // Responsive grid layout for products
          initial={{ opacity: 0, y: 20 }} // Initial animation state: fade in and slide up
          animate={{ opacity: 1, y: 0 }} // Final animation state: fully visible at original position
          transition={{ duration: 0.8 }} // Smooth animation duration
        >
          {/* Display a message if no products are found */}
          {products?.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              {" "}
              {/* Center the message across all columns */}
              No products found
            </h2>
          )}

          {/* Map through the products and render each one using the ProductCard component */}
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage; // Export the CategoryPage component for use in routing or other parts of the application
