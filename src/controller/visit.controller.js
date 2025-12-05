const { StatusCodes } = require("http-status-codes");
const { VisitService } = require("../service");
const { ErrorResponse, SuccessResponse } = require("../utils/common");

const visitService = new VisitService();

async function create(req, res) {
  try {
    const response = await visitService.create({
      employee: req.employee._id,
      purpose: req.body.purpose,
      clientName: req.body.clientName,
      amount: req.body.amount,
      paymentMode: req.body.paymentMode,
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
    const response = await visitService.getAll({
      employeeId: req.employee._id,
      purpose: req.query.purpose,
      date: req.query.date,
      page: req.query.page,
      limit: req.query.limit,
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

async function getForAdmin(req, res) {
  try {
    const response = await visitService.getAll({
      employeeId: req.params.id,
      purpose: req.query.purpose,
      date: req.query.date,
      page: req.query.page,
      limit: req.query.limit,
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
  getAll,
  getForAdmin,
};
