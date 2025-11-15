const { StatusCodes } = require("http-status-codes");
const { AdminService } = require("../service");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

const adminService = new AdminService();

async function create(req, res) {
  try {
    const response = await adminService.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: "USER"
    });
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = {};
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function signIn(req, res) {
  try {
    const response = await adminService.signIn({
      email: req.body.email,
      password: req.body.password,
    });
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}


module.exports = {
  create,
  signIn
};
