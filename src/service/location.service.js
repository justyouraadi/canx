const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app.error");
const { LocationRepository } = require("../repository");
const locationRepository = new LocationRepository();

class LocationService {
  async create(params) {
    try {
      const response = await locationRepository.create(params);
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Location Service");

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        throw new AppError(
          `A Location with this ${field}(${value}) already exists.`,
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

  async getEmployeeLocation(params) {
    try {
      const { employeeId, date } = params;
      const filter = { employee: employeeId };
      if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }
      const locations = await locationRepository.find(filter,{
        sort: { createdAt: -1 },
      })
      return locations;
    } catch (error) {
      console.log(error, "<<< Error in Admin Service getEmployeeLocations");
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
module.exports = LocationService;
