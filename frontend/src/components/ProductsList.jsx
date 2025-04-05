import { motion } from "framer-motion"; // Framer Motion for animations
import { Trash, Star } from "lucide-react"; // Icons for "Delete" and "Feature" actions
import { useProductStore } from "../stores/useProductStore.js"; // Zustand store for managing product data and actions

// ProductsList Component: Displays a table of products with actions like deleting or toggling featured status
const ProductsList = () => {
  // Zustand store hooks
  const { products, deleteProduct, toggleFeaturedProduct } = useProductStore(); // Get products and actions from Zustand store

  // Render UI for the product list
  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-lg sm:max-w-3xl mx-auto" // Container styling for a responsive and visually appealing layout
      initial={{ opacity: 0, y: 20 }} // Animation initial state
      animate={{ opacity: 1, y: 0 }} // Animation final state
      transition={{ duration: 0.8 }} // Smooth animation duration
    >
      {/* Table for displaying products */}
      <table className="min-w-full divide-y divide-gray-700"> {/* Full-width table with dividing lines */}
        {/* Table header */}
        <thead className="bg-gray-700"> {/* Header with background styling */}
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Product {/* Column for product name */}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Price {/* Column for product price */}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Category {/* Column for product category */}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Featured {/* Column for toggling featured status */}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Actions {/* Column for delete button */}
            </th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody className="bg-gray-800 divide-y divide-gray-700"> {/* Body with dividing lines */}
          {/* Map through the list of products to render each row */}
          {products?.map((product) => (
            <tr key={product._id} className="hover:bg-gray-700"> {/* Highlight row on hover */}
              {/* Product name and image */}
              <td className="px-6 py-2 whitespace-nowrap"> {/* Avoid breaking text */}
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover" // Round image with aspect fit
                      src={product.image} // Product image URL
                      alt={product.name} // Alt text for accessibility
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">{product.name}</div> {/* Product name */}
                  </div>
                </div>
              </td>

              {/* Product price */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  ₹ {product.price.toFixed(2)} {/* Display formatted price */}
                </div>
              </td>

              {/* Product category */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{product.category}</div> {/* Display category */}
              </td>

              {/* Featured toggle button */}
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleFeaturedProduct(product._id)} // Toggle featured status on click
                  className={`p-1 rounded-full ${
                    product.isFeatured
                      ? "bg-yellow-400 text-gray-900" // Styling for featured products
                      : "bg-gray-600 text-gray-300" // Styling for non-featured products
                  } hover:bg-yellow-500 transition-colors duration-200`} // Hover effect for button
                >
                  <Star className="h-5 w-5" /> {/* Star icon */}
                </button>
              </td>

              {/* Delete button */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => deleteProduct(product._id)} // Delete product on click
                  className="text-red-400 hover:text-red-300" // Styling with hover effect
                >
                  <Trash className="h-5 w-5" /> {/* Trash icon */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsList; // Export component for use elsewhere
