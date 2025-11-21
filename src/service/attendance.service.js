const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app.error");
const { AttendanceRepository } = require("../repository");

const attendanceRepository = new AttendanceRepository();

class AttendanceService {
  async create(params) {
    try {
      params.date = new Date(new Date(params.date).setHours(0, 0, 0, 0));
      const response = await attendanceRepository.create(params);
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Attendance Service");

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        throw new AppError(
          `An attendance with this ${field}(${value}) already exists.`,
          StatusCodes.CONFLICT
        );
      }

      if (error.name === "ValidationError") {
        const errorMessages = Object.values(error.errors)
          .map((val) => val.message)
          .join(", ");
        throw new AppError(errorMessages, StatusCodes.BAD_REQUEST);
      }

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ["Internal Server Error"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = AttendanceService;
