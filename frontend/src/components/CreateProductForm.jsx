import { useState } from "react"; // React hook for state management
import { motion } from "framer-motion"; // Framer Motion for animations
import { PlusCircle, Upload, Loader } from "lucide-react"; // Icons for UI elements
import toast from "react-hot-toast"; // Library for displaying toast notifications
import { useProductStore } from "../stores/useProductStore.js"; // Zustand store to manage product-related state/actions

// Define static categories array for product creation
const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

// CreateProductForm Component: Handles UI and functionality for creating new products
const CreateProductForm = () => {
  // State to manage the new product form data
  const [newProduct, setNewProduct] = useState({
    name: "", // Product name
    description: "", // Product description
    price: "", // Product price
    category: "", // Product category
    image: "", // Product image (base64 format)
  });

  // Zustand store functions
  const { createProduct, loading } = useProductStore(); // `createProduct` adds new product, `loading` indicates API call status

  // Handle changes to text inputs and select dropdown
  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value }); // Update state dynamically based on input name
  };

  // Handle image file selection and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader(); // FileReader to read the image as base64
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result }); // Update state with base64 image data
      };
      reader.readAsDataURL(file); // Read the file as Data URL
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior (page reload)
    if (!newProduct.image) {
      // Validate if an image is uploaded
      toast.error("Please upload an image"); // Show error toast
      return;
    }
    await createProduct(newProduct); // Call `createProduct` function to add product
    setNewProduct({
      // Reset form after successful creation
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    });
    toast.success("Product created successfully"); // Show success toast
  };

  // Render form UI
  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-4 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }} // Initial animation state (fade-in and slide up)
      animate={{ opacity: 1, y: 0 }} // Target animation state
      transition={{ duration: 0.8 }} // Smooth animation over 0.8 seconds
    >
      {/* Form Title */}
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Product
      </h2>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Product Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name" // Name attribute to identify the field
            value={newProduct.name} // Controlled component: Value from state
            onChange={handleInputChange} // Update state on input change
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
                         px-3 text-white focus:outline-none focus:ring-2
                        focus:ring-emerald-500 focus:border-emerald-500" // Tailwind styling for input
            required // Field is mandatory
          />
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description} // Controlled value
            onChange={handleInputChange}
            rows="2" // Number of rows
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
                         py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
                         focus:border-emerald-500" // Tailwind styling for textarea
            required
          />
        </div>

        {/* Price Field */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Price
          </label>
          <input
            type="number" // Field type: Number
            id="price"
            name="price"
            value={newProduct.price} // Controlled value
            onChange={handleInputChange}
            step="1" // Allow only integers
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
                        py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
                         focus:border-emerald-500"
            required
          />
        </div>

        {/* Category Field */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category} // Controlled value
            onChange={handleInputChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
                         shadow-sm py-2 px-3 text-white focus:outline-none 
                         focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a category</option> {/* Default option */}
            {/* Dynamically render categories */}
            {categories.map((category) => (
              <option key={category} value={category}>
                {category} {/* Category name */}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload Field */}
        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only" // Visually hidden input
            accept="image/*" // Only accept image files
            onChange={handleImageChange} // Handle file selection
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500" // Styling for upload button
          >
            <Upload className="h-5 w-5 inline-block mr-2" /> {/* Upload icon */}
            Upload Image
          </label>
          {newProduct.image && ( // If image uploaded, show confirmation text
            <span className="ml-3 text-sm text-gray-400">Image uploaded</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                    shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50" // Styling for button
          disabled={loading} // Disable button during loading
        >
          {loading ? ( // Show loader if API call is ongoing
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin" // Spinning loader animation
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" /> {/* Plus icon */}
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm; // Export component for use elsewhere
