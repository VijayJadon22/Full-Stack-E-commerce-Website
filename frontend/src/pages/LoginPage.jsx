import { useState } from "react"; // React hook for managing component state
import { motion } from "framer-motion"; // Framer Motion for animations
import { Link } from "react-router-dom"; // React Router's Link component for navigation
import { Mail, Lock, ArrowRight, Loader, LogIn } from "lucide-react"; // Icons for form fields and buttons
import { useUserStore } from "../stores/useUserStore.js"; // Zustand store for managing user-related state and actions

// LoginPage Component: Displays a login form for users
const LoginPage = () => {
  // State to manage the login form input values (email and password)
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Zustand store hooks for authentication
  const { login, loading } = useUserStore(); // `login` function to authenticate and `loading` for login status

  // Handles input value changes for the form
  const handleInputChange = (e) => {
    // Dynamically update the field being edited
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles form submission to perform login
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    login(formData); // Call the `login` function with the entered email and password
  };

  // Render the login page UI
  return (
    <div className="flex flex-col justify-center mt-12 sm:mt-2 sm:px-6 lg:px-8">
      {" "}
      {/* Page container */}
      {/* Animated login page title */}
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }} // Initial animation state: fade in and slide down
        animate={{ opacity: 1, y: 0 }} // Final animation state: fully visible at original position
        transition={{ duration: 0.8 }} // Smooth animation over 0.8 seconds
      >
        <h2 className="text-center text-3xl font-bold text-gray-500">
          {" "}
          {/* Title styling */}
          Signup to get Trendify!
        </h2>
      </motion.div>
      {/* Animated form container */}
      <motion.div
        className="mt-4 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }} // Initial animation state: fade in and slide up
        animate={{ opacity: 1, y: 0 }} // Final animation state: fully visible at original position
        transition={{ duration: 0.8, delay: 0.2 }} // Smooth animation with a slight delay
      >
        <div className="bg-gray-600 pt-8 pb-4 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-2">
            {/* Email field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                {/* Email icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                {/* Email input */}
                <input
                  id="email"
                  type="email" // Input type for email
                  required // Make the field mandatory
                  value={formData.email} // Controlled input value
                  name="email" // Name of the field for dynamic updates
                  onChange={handleInputChange} // Update state on change
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                                     placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="stevesmith@email.com" // Placeholder text
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                {/* Lock icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                {/* Password input */}
                <input
                  id="password"
                  type="password" // Input type for password
                  required // Make the field mandatory
                  value={formData.password} // Controlled input value
                  name="password" // Name of the field for dynamic updates
                  onChange={handleInputChange} // Update state on change
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                                     placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="***********" // Placeholder text
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent 
                            rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
                             hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                              focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 mt-4"
              disabled={loading} // Disable the button if login is in progress
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin" // Spinning loader icon
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />{" "}
                  {/* Login icon */}
                  Login
                </>
              )}
            </button>
          </form>

          {/* Signup link */}
          <p className="mt-2 text-center text-sm text-gray-400">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              Signup here <ArrowRight className="inline h-4 w-4" />{" "}
              {/* Arrow icon */}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage; // Export the LoginPage component for use in routing or other parts of the application
