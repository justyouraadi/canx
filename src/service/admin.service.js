const { StatusCodes } = require("http-status-codes");
const { AdminRepository } = require("../repository");
const AppError = require("../utils/errors/app.error");
const adminRepository = new AdminRepository();

class AdminService {
  async create(params) {
    try {
      const response = await adminRepository.create(params);
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Admin Service");

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        throw new AppError(
          `An account with this ${field}(${value}) already exists.`,
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

  async signIn(params) {
    try {
      const checkIfAdminExists = await adminRepository.findOne({
        email: params.email,
      });
      if (!checkIfAdminExists) {
        throw new AppError(
          "No admin found with the given email address.",
          StatusCodes.NOT_FOUND
        );
      }

      const comparePassword = await checkIfAdminExists.comparePassword(
        params.password
      );

      if (!comparePassword) {
        throw new AppError(
          "The password you have entered is incorrect.",
          StatusCodes.UNAUTHORIZED
        );
      }

      if( checkIfAdminExists.email === params.email  && comparePassword ){
        const token = await checkIfAdminExists.generateJWTToken();
        return token;
      }
      else{
        throw new AppError(
          "Invalid email or password.",
          StatusCodes.UNAUTHORIZED
        );
      }
    } catch (error) {
      console.log(error, "<<< Error in Admin Service");

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        throw new AppError(
          `An account with this ${field}(${value}) already exists.`,
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

module.exports = AdminService;
