const { StatusCodes } = require("http-status-codes");
const { DepartmentService } = require("../service");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

const departmentService = new DepartmentService();

async function create(req, res) {
  try {
    const response = await departmentService.create({
      name: req.body.name
    });
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = {};
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getAll(req, res) {
  try {
    const response = await departmentService.getAll({
      name: req.query.name,
      page: req.query.page,
      limit: req.query.limit
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
  getAll
};
