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
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function checkOut(req, res) {
  try {
    const response = await attendanceService.checkOut({
      employee: req.employee._id,
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

async function checkTodayCheckedIn(req, res) {
  try {
    const response = await attendanceService.checkTodayCheckedIn({
      employee: req.employee._id,
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

async function getEmployeeAttendanceForAdmin(req,res){
   try {
    const response = await attendanceService.getEmployeeAttendanceForAdmin({
      employee: req.params.employee,
      date: new Date(new Date(new Date()).setHours(0, 0, 0, 0))
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
  checkOut,
  checkTodayCheckedIn,
  getEmployeeAttendanceForAdmin
};
