const mongoose = require("mongoose");
const serverConfig = require("./server.config");

const connectToDB = async () => {
  try {
    const { connection } = await mongoose.connect(
      serverConfig.Database.MONGODB_URI
    );
    if (connection) {
      console.log(
        `Connected to MongoDB at ${connection.host}:${connection.port}`
      );
    }
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectToDB;
