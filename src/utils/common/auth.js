const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");

function verifyToken(token) {
  try {
    const data = jwt.verify(token, ServerConfig.JWT.SECRET);
    return data;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  verifyToken,
};
