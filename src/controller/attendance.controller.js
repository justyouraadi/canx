const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { AttendanceService } = require("../service");

const attendanceService = new AttendanceService();

async function create(req, res) {
  try {
    const response = await attendanceService.create({
      employee: req.employee._id,
      date: new Date(),
      checkInTime: new Date(),
    });
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = {};
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  create,
};
