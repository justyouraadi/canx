const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const SlipService = require("../service/slip.service");

const slipService = new SlipService();

async function generateSlip(req, res) {
  try {
    const response = await slipService.generateSlip({
      employee: req.body.employeeId,
      month: req.body.month,
      year: req.body.year,
      bonus: req.body.bonus,
      deductions: req.body.deductions,
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
    const response = await slipService.getAll({
      date: req.query.date,
      page: req.query.page,
      limit: req.query.limit,
      status: req.query.status,
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
async function getForParticularEmployee(req, res) {
  try {
    const response = await slipService.getForParticularEmployee({
      date: req.query.date,
      page: req.query.page,
      limit: req.query.limit,
      employee: req.employee._id,
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

async function updateStatus(req, res) {
  try {
    const response = await slipService.updateStatus({
      id: req.body.id,
      status: req.body.status,
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

module.exports = {
  generateSlip,
  updateStatus,
  getAll,
  getForParticularEmployee
};
