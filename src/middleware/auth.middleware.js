const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app.error");
const { EmployeeService } = require("../service");

const employeeService = new EmployeeService();

async function checkEmpAuth(req, res, next) {
  try {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) {
      throw new AppError("Missing JWT Token", StatusCodes.FORBIDDEN);
    }
    const data = token.split(" ")[1];
    const response = await employeeService.isAuthenticated(data);
    if (response) {
      req.employee = response;
      next();   
    } else {
      throw new AppError("Invalid JWT Token", StatusCodes.FORBIDDEN);
    }
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  checkEmpAuth,
};
