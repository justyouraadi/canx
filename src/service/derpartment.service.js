const { StatusCodes } = require("http-status-codes");
const { DepartmentRepository } = require("../repository");
const AppError = require("../utils/errors/app.error");
const departmentRepository = new DepartmentRepository();

class DepartmentService {
  async create(params) {
    try {
      const response = await departmentRepository.create(params);
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Department Service");

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        throw new AppError(
          `A department with this ${field}(${value}) already exists.`,
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

  async getAll(params) {
    try {
      const { name, page, limit } = params;
      const filter = {};
      if (name) {
        filter.name = new RegExp(name, "i");
      }

      const limitNumber = parseInt(limit, 10) || 10;
      const pageNumber = parseInt(page, 10) || 1;
      const skip = (pageNumber - 1) * limitNumber;

      const opts = {
        limit: limitNumber,
        skip: skip,
        sort: { name: 1 },
      };

      const dataPromise = departmentRepository.find(filter, opts);
      const countPromise = departmentRepository.count(filter);

      const [data, totalCount] = await Promise.all([dataPromise, countPromise]);
      return {
          totalCount,
          totalPages: Math.ceil(totalCount / limitNumber),
          currentPage: pageNumber,
          departments: data,
      };
    } catch (error) {
      console.log(error, "<<< Error in Department Service getAll");
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Internal Server Error",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = DepartmentService;
