const mongoose = require("mongoose");
/**
 * Connects to the MongoDB database using the URI in the `DB_URI` environment variable.
 * @async
 * @function
 */
exports.connectdb = async () => {
  const url = process.env.DB_URI;
  try {
    await mongoose.connect(url);

    console.log("connected to DB successfully");
  } catch (error) {
    console.log("Failed to connect: ", error);
  }
};
