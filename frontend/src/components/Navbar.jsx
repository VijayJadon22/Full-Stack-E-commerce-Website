import React from "react";
import {
  Lock,
  LogIn,
  LogOut,
  ShoppingCart,
  User,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = false;
  const isAdmin = true;
  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-red-500 via-pink-400 to-purple-400 bg-opacity-90 shadow-lg z-40 transition-all duration-300  border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            to={"/"}
            className="text-2xl font-bold text-white items-center space-x-2 flex"
          >
            Trendify
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={"/"}
              className="text-gray-300 hover:text-fuchsia-700 transition duration-300
					 ease-in-out"
            >
              Home
            </Link>
            {user && (
              <Link
                to={"/cart"}
                className="relative group text-gray-300 hover:text-fuchsia-700 transition duration-300
					 ease-in-out"
              >
                <span className="hidden sm:inline">Cart</span>
                <ShoppingCart
                  className="inline-block ml-1 group-hover:text-amerald-400"
                  size={20}
                />
                <span
                  className="absolute -top-2 -right-3 bg-fuchsia-500 text-white rounded-full px-2 py-0.5 
									text-xs  transition duration-300 ease-in-out"
                >
                  3
                </span>
              </Link>
            )}
            {isAdmin && (
              <Link
                className="='bg-emerald-700 hover:bg-violet-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center"
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Signup
                </Link>
                <Link
                  to={"/login"}
                  className="bg-fuchsia-700 hover:bg-fuchsia-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
