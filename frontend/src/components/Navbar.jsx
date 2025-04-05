import React from "react"; // Core React library
import {
  Lock,
  LogIn,
  LogOut,
  ShoppingCart,
  User,
  UserPlus,
} from "lucide-react"; // Icon components for navbar items
import { Link } from "react-router-dom"; // React Router's Link component for navigation
import { useUserStore } from "../stores/useUserStore"; // Zustand store for user management
import { useCartStore } from "../stores/useCartStore"; // Zustand store for cart management

// Navbar Component: Displays the top navigation bar with links and user-specific actions
const Navbar = () => {
  // Zustand store hooks
  const { user, logout } = useUserStore(); // Fetch user data and the logout function
  const isAdmin = user?.role === "admin"; // Check if the logged-in user is an admin

  const { cart } = useCartStore(); // Fetch cart data

  return (
    // Main container for the navbar
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-neutral-400 via-gray-500 to-gray-600 bg-opacity-90 shadow-lg z-40 transition-all duration-300 border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        {" "}
        {/* Centered content container */}
        <div className="flex flex-wrap justify-between items-center">
          {" "}
          {/* Flexbox for layout */}
          {/* Logo or brand name with navigation to the home page */}
          <Link
            to={"/"}
            className="text-2xl font-bold text-gray-800 items-center space-x-2 flex"
          >
            Trendify
          </Link>
          {/* Navigation links and user actions */}
          <nav className="flex flex-wrap items-center gap-4">
            {/* Home link */}
            <Link
              to={"/"}
              className="text-white hover:text-gray-800 transition duration-300 ease-in-out"
            >
              Home
            </Link>

            {/* Cart link: Visible only for logged-in users */}
            {user && (
              <Link
                to={"/cart"}
                className="mr-2 relative group text-white hover:text-gray-800 transition duration-300 ease-in-out"
              >
                <span className="hidden sm:inline">Cart</span>{" "}
                {/* Label visible on larger screens */}
                <ShoppingCart
                  className="inline-block ml-1 group-hover:text-amerald-400" // Cart icon
                  size={20} // Icon size
                />
                {/* Display cart item count if the cart is not empty */}
                {cart?.length > 0 && (
                  <span className="absolute -top-2 -right-3 text-white bg-emerald-500 rounded-full px-2 py-0.5 text-xs transition duration-300 ease-in-out">
                    {cart.length} {/* Dynamic count of cart items */}
                  </span>
                )}
              </Link>
            )}

            {/* Admin dashboard link: Visible only for admin users */}
            {isAdmin && (
              <Link
                to={"/secret-dashboard"}
                className=" text-white px-3 hover:text-gray-800 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
              >
                <Lock className="inline-block mr-1" size={18} />{" "}
                {/* Lock icon */}
                <span className="hidden sm:inline">Dashboard</span>{" "}
                {/* Label visible on larger screens */}
              </Link>
            )}

            {/* User-specific actions: Login/Signup or Logout */}
            {user ? (
              // Logout button for logged-in users
              <button
                onClick={logout} // Call logout function on click
                className="text-white py-2 px-4 hover:text-gray-800 rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <LogOut size={18} /> {/* LogOut icon */}
                <span className="hidden sm:inline ml-2">Logout</span>{" "}
                {/* Label visible on larger screens */}
              </button>
            ) : (
              <>
                {/* Signup link for unauthenticated users */}
                <Link
                  to={"/signup"}
                  className="text-white py-2 hover:text-gray-800 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} /> {/* UserPlus icon */}
                  <span className="hidden sm:inline">Signup</span>{" "}
                  {/* Label visible on larger screens */}
                </Link>
                {/* Login link for unauthenticated users */}
                <Link
                  to={"/login"}
                  className="text-white py-2 mr-2 hover:text-gray-800 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} /> {/* LogIn icon */}
                  <span className="hidden sm:inline">Login</span>{" "}
                  {/* Label visible on larger screens */}
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar; // Export the component for use elsewhere
