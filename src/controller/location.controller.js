const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { LocationService } = require("../service");

const locationService = new LocationService();

async function create(req, res) {
  try {
    const response = await locationService.create({
      employee: req.employee._id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      deviceTimestamp: req.body.deviceTimestamp,
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

async function getEmployeeLocation(req, res) {
  try {
    const response = await locationService.getEmployeeLocation({
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
  getEmployeeLocation
};
