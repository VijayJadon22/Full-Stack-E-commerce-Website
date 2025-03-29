// Import ioredis library for interacting with a Redis database
import Redis from "ioredis";

// Import dotenv to securely load environment variables from a .env file
import dotenv from "dotenv";

// Load environment variables into process.env
dotenv.config();

// Create and export a Redis client instance using the Upstash Redis URL
export const redis = new Redis(process.env.UPSTASH_REDIS_URL); // The connection URL is securely retrieved from environment variables

// Example usage: Setting a key-value pair in the Redis database
// This sets 'foo' as the key and 'bar' as its value in the Redis database
await redis.set('foo', 'bar');
