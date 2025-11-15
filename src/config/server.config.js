const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  Base: {
    PORT: process.env.PORT,
  },
  Database: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  }
};
