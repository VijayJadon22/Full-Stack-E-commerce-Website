// Import Cloudinary library for managing media assets
import { v2 as cloudinary } from "cloudinary";

// Import dotenv to load environment variables from a .env file
import dotenv from "dotenv";

// Load environment variables from .env file into process.env
dotenv.config();

// Configure the Cloudinary instance with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary account's cloud name
    api_key: process.env.CLOUDINARY_API_KEY, // Your Cloudinary account's API key
    api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary account's API secret
});

// Export the configured Cloudinary instance for use throughout the application
export default cloudinary;
