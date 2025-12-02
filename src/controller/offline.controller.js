const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { OfflineService } = require("../service");

const offlineService = new OfflineService();

async function create(req, res) {
  try {
    const response = await offlineService.create({
      employee: req.employee._id
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

async function getEmployeeOfflineDataForApp(req, res) {
  try {
    const response = await offlineService.getAll({
      employeeId: req.employee._id,
      date: req.query.date,
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

async function getEmployeeOfflineDataForAdmin(req, res) {
  try {
    const response = await offlineService.getAll({
      employeeId: req.params.employeeId,
      date: req.query.date,
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
  getEmployeeOfflineDataForApp,
  getEmployeeOfflineDataForAdmin
};
