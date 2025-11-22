const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app.error");
const { AttendanceRepository } = require("../repository");
const LocationService = require("./location.service");

const attendanceRepository = new AttendanceRepository();
const locationService = new LocationService();

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

  async checkOut(params) {
    try {
      const attendanceRecord = await attendanceRepository.findOne({
        employee: params.employee,
        date: new Date(new Date(new Date()).setHours(0, 0, 0, 0)),
      });
      if (!attendanceRecord) {
        throw new AppError(
          "Attendance record not found for check-out.",
          StatusCodes.NOT_FOUND
        );
      }

      if (attendanceRecord.checkOutTime) {
        throw new AppError(
          "Employee has already checked out for the day.",
          StatusCodes.BAD_REQUEST
        );
      }

      const { totalDistance, totalFare, perKmFare } =
        await locationService.calculateDistanceAndCalculate({
          employee: params.employee,
          date: new Date(new Date(new Date()).setHours(0, 0, 0, 0)),
        });

      const updatedRecord = await attendanceRepository.updateById(
        attendanceRecord._id,
        { checkOutTime: new Date(), totalDistance, totalFare, perKmFare }
      );

      if (!updatedRecord) {
        throw new AppError(
          "Failed to update attendance record for check-out.",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return updatedRecord;
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

  async checkTodayCheckedIn(params) {
    try {
      const attendanceRecord = await attendanceRepository.findOne({
        employee: params.employee,
        date: new Date(new Date(new Date()).setHours(0, 0, 0, 0)),
      });
      if (!attendanceRecord) {
        throw new AppError(
          "Attendance record not found for check-out.",
          StatusCodes.NOT_FOUND
        );
      }

      return attendanceRecord;
    } catch (error) {
      console.log(error, "<<< Error in Attendance Service");

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
