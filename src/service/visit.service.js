const { StatusCodes } = require("http-status-codes");
const { VisitRepository } = require("../repository");
const AppError = require("../utils/errors/app.error");

const visitRepository = new VisitRepository();

class VisitService {
  async create(params) {
    try {
      const response = await visitRepository.create(params);
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Visit Service");

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

  async getAll(params) {
    try {
      const { employeeId, date, purpose, page, limit } = params;
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
      if (purpose) {
        filter.purpose = purpose;
      }

      const limitNumber = parseInt(limit, 10) || 10;
      const pageNumber = parseInt(page, 10) || 1;
      const skip = (pageNumber - 1) * limitNumber;

      const opts = {
        limit: limitNumber,
        skip: skip,
        sort: { createdAt: -1 },
      };

      const visitsPromise = visitRepository.find(filter, {
        ...opts,
        populate: {
          path: "employee",
          select: "name email phone",
        },
      });
      const countPromise = visitRepository.count(filter);

      const [visits, totalCount] = await Promise.all([
        visitsPromise,
        countPromise,
      ]);

      return {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        currentPage: pageNumber,
        visits,
      };
    } catch (error) {
      console.log(error, "<<< Error in Visit Service");
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

module.exports = VisitService;
