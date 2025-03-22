// Importing mongoose library to define and interact with the MongoDB schema
import mongoose from "mongoose";
// Importing bcryptjs library to handle password hashing for security
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Defining a user schema using mongoose.Schema
const userSchema = new mongoose.Schema({
    // 'name' field for the user's name
    name: {
        type: String, // Specifies the data type as String
        required: [true, "Name is required"] // Makes the field mandatory with a custom error message
    },
    // 'email' field for the user's email address
    email: {
        type: String, // Specifies the data type as String
        required: [true, "Email is required"], // Makes the field mandatory with a custom error message
        unique: true, // Ensures that the email is unique in the database
        lowercase: true, // Converts the email to lowercase before saving
        trim: true, // Removes extra spaces from the email
    },
    // 'password' field for the user's password
    password: {
        type: String, // Specifies the data type as String
        required: [true, "Password is required"], // Makes the field mandatory with a custom error message
        minlength: [6, "Password must be atleast 6 characters long"] // Enforces a minimum length of 6 characters
    },
    // 'cartItems' field for the user's shopping cart items (array of objects)
    cartItems: [
        {
            quantity: {
                type: Number, // Specifies the data type as Number
                default: 1 // Sets a default value of 1 for the quantity
            },
            product: {
                type: mongoose.Schema.Types.ObjectId, // References the 'Product' model using an ObjectId
                ref: "Product" // Defines the reference model as "Product"
            }
        }
    ],
    // 'role' field to define the user's role (either admin or customer)
    role: {
        type: String, // Specifies the data type as String
        enum: ["admin", "customer"], // Restricts the value to either 'admin' or 'customer'
        default: "customer" // Sets the default role as 'customer'
    }
}, { timestamps: true }); // Adds 'createdAt' and 'updatedAt' timestamps automatically

// Pre-save middleware to hash the password before saving the document
userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) { // Checks if the password is new or modified
        const salt = await bcrypt.genSalt(10); // Generates a salt for hashing with 10 rounds
        this.password = await bcrypt.hash(this.password, salt); // Hashes the password with the salt
    }
    next(); // Proceeds to the next middleware
});

// Instance method to compare the provided password with the stored hashed password
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password); // Compares the plain-text password with the hashed one
};

userSchema.methods.generateTokens = function (userId) {
    // Generate an access token for the user
    const accessToken = jwt.sign(
        { userId }, // Payload: userId
        process.env.ACCESS_TOKEN_SECRET, // Secret key for signing the token
        { expiresIn: "15m" } // The token is set to expire in 15 minutes ("15m")
    );

    // Generate a refresh token for the user
    const refreshToken = jwt.sign(
        { userId }, // Payload: userId
        process.env.REFRESH_TOKEN_SECRET, // Secret key for signing the token
        { expiresIn: "7d" } // The refresh token is set to expire in 7 days ("7d")
    );
    // Return both the access token and refresh token
    return { accessToken, refreshToken };
};


// Creating a mongoose model named 'User' using the userSchema
const User = mongoose.model("User", userSchema);

// Exporting the 'User' model for use in other files
export default User;
