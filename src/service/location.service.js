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
}

module.exports = LocationService;
