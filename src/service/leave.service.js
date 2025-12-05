const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app.error");
const { LeaveRepository } = require("../repository");

const leaveRepository = new LeaveRepository();

class LeaveService {
  async create(params) {
    try {
      const response = await leaveRepository.create(params);
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Leave Service");

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

  async replyOnLeave(params) {
    try {
      const leave = await leaveRepository.findOne({ _id: params.leaveId });
      if (!leave) {
        throw new AppError(["Leave not found"], StatusCodes.NOT_FOUND);
      }
      if (leave.status === params.status) {
        throw new AppError(
          ["Leave already in the same status"],
          StatusCodes.BAD_REQUEST
        );
      }
      if (leave.status !== "Pending") {
        throw new AppError(
          ["Only Pending leaves can be replied to"],
          StatusCodes.BAD_REQUEST
        );
      }
      const response = await leaveRepository.updateById(
        leave._id,
        {
          status: params.status,
          response: params.response,
        },
        { new: true }
      );
      if (!response) {
        throw new AppError(
          ["Leave not updated, try again later"],
          StatusCodes.BAD_REQUEST
        );
      }
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Leave Service");

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
      const { employeeId, date, status, page, limit } = params;
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
      if (status) {
        filter.status = status;
      }

      const limitNumber = parseInt(limit, 10) || 10;
      const pageNumber = parseInt(page, 10) || 1;
      const skip = (pageNumber - 1) * limitNumber;

      const opts = {
        limit: limitNumber,
        skip: skip,
        sort: { createdAt: -1 },
      };

      const leavesPromise = leaveRepository.find(filter, {
        ...opts,
        populate: {
          path: "employee",
          select: "name email phone",
        },
      });
      const countPromise = leaveRepository.count(filter);

      const [leaves, totalCount] = await Promise.all([
        leavesPromise,
        countPromise,
      ]);

      return {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        currentPage: pageNumber,
        leaves,
      };
    } catch (error) {
      console.log(error, "<<< Error in Leave Service");
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ["Internal Server Error"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getAllForAdmin(params) {
    try {
      const { date, status, page, limit } = params;
      let filter = {}
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
      if (status) {
        filter.status = status;
      }

      const limitNumber = parseInt(limit, 10) || 10;
      const pageNumber = parseInt(page, 10) || 1;
      const skip = (pageNumber - 1) * limitNumber;

      const opts = {
        limit: limitNumber,
        skip: skip,
        sort: { createdAt: -1 },
      };

      const leavesPromise = leaveRepository.find(filter, {
        ...opts,
        populate: {
          path: "employee",
          select: "name email phone",
        },
      });
      const countPromise = leaveRepository.count(filter);

      const [leaves, totalCount] = await Promise.all([
        leavesPromise,
        countPromise,
      ]);

      return {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        currentPage: pageNumber,
        leaves,
      };
    } catch (error) {
      console.log(error, "<<< Error in Leave Service");
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
module.exports = LeaveService;
