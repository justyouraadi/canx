const { StatusCodes } = require("http-status-codes");
const { LeaveService } = require("../service");
const { ErrorResponse, SuccessResponse } = require("../utils/common");

const leaveService = new LeaveService();

async function create(req, res) {
  try {
    const response = await leaveService.create({
      employee: req.employee._id,
      type: req.body.type,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      reason: req.body.reason,
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

async function replyOnLeave(req, res) {
  try {
    const response = await leaveService.replyOnLeave({
      employee: req.body.employee,
      leaveId: req.body.leaveId,
      status: req.body.status,
      response: req.body.response,
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

async function getAll(req, res) {
  try {
    const response = await leaveService.getAll({
      employeeId: req.employee._id,
      status: req.query.status,
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

async function getAllForAdmin(req, res) {
  try {
    const response = await leaveService.getAllForAdmin({
    //   employeeId: req.employee._id,
      status: req.query.status,
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
  replyOnLeave,
  getAll,
  getAllForAdmin
};
