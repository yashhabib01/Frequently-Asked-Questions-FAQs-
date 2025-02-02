const { createClient } = require("redis");
/**
 * Redis Client Configuration
 * @summary Establishes a connection to the Redis server using credentials from environment variables.
 * @description This module initializes a Redis client and connects to the Redis server. It listens for errors and logs them. The connection is established asynchronously, and a success or failure message is logged accordingly.
 *
 * @property {string} username - The Redis username, defaulting to "default".
 * @property {string} password - The Redis password, taken from the environment variable REDIS_PASSWORD.
 * @property {string} socket.host - The Redis host, taken from the environment variable REDIS_HOST.
 * @property {number} socket.port - The Redis port, taken from the environment variable REDIS_PORT.
 *
 * @throws {Error} - Logs an error if the Redis connection fails.
 *
 */

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis successfully!");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
};

connectRedis();

module.exports = redisClient;
