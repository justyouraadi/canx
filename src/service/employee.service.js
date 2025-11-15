const { StatusCodes } = require("http-status-codes");
const { EmployeeRepository } = require("../repository");
const AppError = require("../utils/errors/app.error");
const employeeRepository = new EmployeeRepository();

class EmployeeService {
  async create(params) {
    try {
      const response = await employeeRepository.create(params);
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Employee Service");

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        throw new AppError(
          `A Employee with this ${field}(${value}) already exists.`,
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

      const dataPromise = employeeRepository.find(filter, {
        ...opts,
        select: "-password",
      });
      const countPromise = employeeRepository.count(filter);

      const [data, totalCount] = await Promise.all([dataPromise, countPromise]);
      return {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        currentPage: pageNumber,
        employees: data,
      };
    } catch (error) {
      console.log(error, "<<< Error in Employee Service getAll");
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Internal Server Error",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getById(id) {
    try {
      const employee = await employeeRepository.findById(id, {
        select: "-password",
      });
      if (!employee) {
        throw new AppError(
          "No employee found with the corresponding details.",
          StatusCodes.NOT_FOUND
        );
      }
      return employee;
    } catch (error) {
        console.log(error, "<<< Error in Employee Service getById");
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

module.exports = EmployeeService;
