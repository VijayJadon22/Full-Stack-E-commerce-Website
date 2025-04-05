import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"; // Icons for cart and navigation buttons
import { useCartStore } from "../stores/useCartStore.js"; // Zustand store for managing cart state
import { useUserStore } from "../stores/useUserStore.js"; // Zustand store for managing user state
import toast from "react-hot-toast"; // Library for displaying toast notifications

// Define the FeaturedProducts component
const FeaturedProducts = ({ featuredProducts }) => {
  // State to track the current index for the carousel (position of slides)
  const [currentIndex, setCurrentIndex] = useState(0);

  // State to determine how many items are displayed per page based on screen size
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Access Zustand store functions and state
  const { addToCart } = useCartStore(); // Function to add items to the cart
  const { user } = useUserStore(); // Get the user state (to check if logged in)

  // Function to handle adding a product to the cart
  const handleAddToCart = (product) => {
    // Check if the user is logged in
    if (!user) {
      // Show error toast notification if user is not logged in
      toast.error("Please login to add to cart", { id: "addToCart" });
      return;
    }
    // Call the addToCart function from Zustand store
    addToCart(product);
  };

  // useEffect to dynamically adjust the number of items displayed per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      // Adjust itemsPerPage based on screen width
      if (window.innerWidth < 640)
        setItemsPerPage(1); // Small screens (e.g., mobile)
      else if (window.innerWidth < 1024)
        setItemsPerPage(2); // Medium screens (e.g., tablets)
      else if (window.innerWidth < 1280) setItemsPerPage(3); // Large screens
      else setItemsPerPage(4); // Extra-large screens
    };

    // Call handleResize immediately to set initial items per page
    handleResize();

    // Add a listener to update items per page dynamically when the window is resized
    window.addEventListener("resize", handleResize);

    // Clean up by removing the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to move the carousel forward
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  };

  // Function to move the carousel backward
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  };

  // Disable the "Previous" button if at the start of the carousel
  const isStartDisabled = currentIndex === 0;

  // Disable the "Next" button if at the end of the carousel
  const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  // Return JSX for the component layout
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header title for featured products */}
        <h2 className="text-center text-4xl font-bold text-gray-600 mb-4">
          Featured
        </h2>
        <div className="relative">
          {/* Carousel container */}
          <div className="overflow-hidden">
            {/* Wrapper for the product slides */}
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerPage) // Move carousel based on currentIndex and itemsPerPage
                }%)`,
              }}
            >
              {/* Render each product as a carousel slide */}
              {featuredProducts?.map((product) => (
                <div
                  key={product._id} // Use unique product ID as the key
                  className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2"
                >
                  {/* Individual product card */}
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30">
                    {/* Product image */}
                    <div className="overflow-hidden">
                      <img
                        src={product.image} // Source of the product image
                        alt={product.name} // Alt text for accessibility
                        className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110" // Zoom effect on hover
                      />
                    </div>
                    {/* Product details */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-white">
                        {product.name} {/* Product name */}
                      </h3>
                      <p className="text-emerald-300 font-medium mb-4">
                        ${product.price.toFixed(2)}{" "}
                        {/* Product price formatted */}
                      </p>
                      {/* Add to Cart button */}
                      <button
                        onClick={() => handleAddToCart(product)} // Call handleAddToCart function when clicked
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 
                                                flex items-center justify-center"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />{" "}
                        {/* Cart icon */}
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Previous button */}
          <button
            onClick={prevSlide} // Call prevSlide function when clicked
            disabled={isStartDisabled} // Disable if at the beginning
            className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
              isStartDisabled
                ? "bg-gray-400 cursor-not-allowed" // Disabled styling
                : "bg-emerald-600 hover:bg-emerald-500" // Enabled styling
            }`}
          >
            <ChevronLeft className="w-6 h-6" /> {/* Left arrow icon */}
          </button>

          {/* Next button */}
          <button
            onClick={nextSlide} // Call nextSlide function when clicked
            disabled={isEndDisabled} // Disable if at the end
            className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
              isEndDisabled
                ? "bg-gray-400 cursor-not-allowed" // Disabled styling
                : "bg-emerald-600 hover:bg-emerald-500" // Enabled styling
            }`}
          >
            <ChevronRight className="w-6 h-6" /> {/* Right arrow icon */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts; // Export the component for use elsewhere
