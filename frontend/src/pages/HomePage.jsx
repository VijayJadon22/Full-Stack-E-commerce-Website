// Import necessary libraries and components
import React, { useEffect } from "react"; // Core React functionality and hooks
import CategoryItem from "../components/CategoryItem.jsx"; // Component to display individual categories
import { motion } from "framer-motion"; // Framer Motion for adding animations
import { useProductStore } from "../stores/useProductStore.js"; // Zustand store for managing product data
import FeaturedProducts from "../components/FeaturedProducts.jsx"; // Component to display featured products
import { useUserStore } from "../stores/useUserStore.js"; // Zustand store for managing user data

// Array of categories with their respective links, names, and image URLs
const categories = [
  {
    href: "/jeans", // Link to the "Jeans" category page
    name: "Jeans",
    imageUrl:
      "https://i.pinimg.com/originals/0d/a3/ce/0da3ce42bb345bb956365f82b40cd98d.jpg",
  },
  {
    href: "/t-shirts", // Link to the "T-shirts" category page
    name: "T-shirts",
    imageUrl:
      "https://th.bing.com/th/id/OIP.8d10izBcVWbcrPaQhcfRwQHaJ3?rs=1&pid=ImgDetMain",
  },
  {
    href: "/shoes", // Link to the "Shoes" category page
    name: "Shoes",
    imageUrl:
      "https://th.bing.com/th/id/OIP.rMUB07XQeta-yb-uYcg6vQHaIw?rs=1&pid=ImgDetMain",
  },
  {
    href: "/glasses", // Link to the "Glasses" category page
    name: "Glasses",
    imageUrl:
      "https://i.pinimg.com/originals/d2/bb/ae/d2bbaee75b971f7becd3b71ccca88d66.jpg",
  },
  {
    href: "/jackets", // Link to the "Jackets" category page
    name: "Jackets",
    imageUrl:
      "https://th.bing.com/th/id/OIP.wfTVSOLUpgtH5JSfe7OueAHaG4?rs=1&pid=ImgDetMain",
  },
  {
    href: "/suits", // Link to the "Suits" category page
    name: "Suits",
    imageUrl:
      "https://img.mensxp.com/media/content/2023/Feb/iStock-1127767024_63edce9b49f76.jpeg",
  },
  {
    href: "/bags", // Link to the "Bags" category page
    name: "Bags",
    imageUrl:
      "https://th.bing.com/th/id/OIP.kalSOW4jME0yQH3H0xBeSQHaHK?rs=1&pid=ImgDetMain",
  },
];

// HomePage Component: Displays the home page with categories and featured products
const HomePage = () => {
  // Zustand store hooks
  const { user } = useUserStore(); // Retrieve user data
  const { fetchFeaturedProducts, products, isLoading } = useProductStore(); // Retrieve product-related actions and state

  // Fetch featured products when the component mounts
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]); // Dependency array ensures this effect runs only once when the component mounts

  // Render the home page UI
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {" "}
      {/* Page container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
        {" "}
        {/* Centered and responsive container */}
        {/* Animated page title */}
        <motion.h1
          className="text-center text-2xl sm:text-4xl font-bold text-gray-600 mb-4" // Styling for the title
          initial={{ opacity: 0, y: -20 }} // Initial animation state: fade in and slide down
          animate={{ opacity: 1, y: 0 }} // Final animation state: fully visible at original position
          transition={{ duration: 0.8 }} // Smooth animation over 0.8 seconds
        >
          Shop Our Categories
        </motion.h1>
        {/* Subheading */}
        <p className="text-center text-xl text-gray-500 mb-12">
          {" "}
          {/* Styling for the subheading */}
          Discover the latest trends in eco-friendly fashion
        </p>
        {/* Animated categories grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-12" // Responsive grid layout for categories
          initial={{ opacity: 0, y: 20 }} // Initial animation state: fade in and slide up
          animate={{ opacity: 1, y: 0 }} // Final animation state: fully visible at original position
          transition={{ duration: 0.8 }} // Smooth animation duration
        >
          {/* Render each category item */}
          {categories.map((category) => (
            <CategoryItem key={category.name} category={category} />
          ))}
        </motion.div>
        {/* Display featured products if not loading and products are available */}
        {!isLoading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
    </div>
  );
};

export default HomePage; // Export the HomePage component for use in routing or other parts of the application
