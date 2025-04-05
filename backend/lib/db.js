import mongoose from "mongoose";

// This function uses Mongoose to establish a connection with a MongoDB database.
export const connectToDB = async () => {
    try {
        // Attempt to connect to the database using the URI stored in the environment variable MONGO_URI.
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // Log a message to the console indicating that the connection to MongoDB was successful.
        // conn.connection.host provides the hostname of the connected MongoDB instance.
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        // If an error occurs during the connection attempt, log the error message to the console.
        console.log("Error connecting to MongoDB: ", error.message);
        // Exit the process with a failure status code (1) if the connection fails.
        // process.exit(1) ensures the application terminates if the database connection is unsuccessful.
        process.exit(1);
    }
};
