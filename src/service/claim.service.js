const { StatusCodes } = require("http-status-codes");
const { ClaimRepository } = require("../repository");
const AppError = require("../utils/errors/app.error");

const claimRepository = new ClaimRepository();

class ClaimService {
  async create(params) {
    try {
      const response = await claimRepository.create(params);
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Claim Service");

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

  async replyOnClaim(params) {
    try {
      const claim = await claimRepository.findOne({ _id: params.claimId });
      if (!claim) {
        throw new AppError(["Claim not found"], StatusCodes.NOT_FOUND);
      }
      if (claim.status === params.status) {
        throw new AppError(
          ["Claim already in the same status"],
          StatusCodes.BAD_REQUEST
        );
      }
      if (claim.status !== "PENDING") {
        throw new AppError(
          ["Only Pending claims can be replied to"],
          StatusCodes.BAD_REQUEST
        );
      }
      const response = await claimRepository.updateById(
        claim._id,
        {
          status: params.status,
          response: params.response,
        },
        { new: true }
      );
      if (!response) {
        throw new AppError(
          ["Claim not updated, try again later"],
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

  async getAllEmployeeClaims(params) {
    try {
      const { date, status, page, limit, employeeId } = params;
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

      const claimsPromise = claimRepository.find(filter, {
        ...opts,
        populate: {
          path: "employee",
          select: "name email phone",
        },
      });
      const countPromise = claimRepository.count(filter);

      const [claims, totalCount] = await Promise.all([
        claimsPromise,
        countPromise,
      ]);

      return {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        currentPage: pageNumber,
        claims,
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
  async getForAdmin(params) {
    try {
      const { date, status, page, limit } = params;
      // const filter = { employee: employeeId };
      const filter = {};
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

      const claimsPromise = claimRepository.find(filter, {
        ...opts,
        populate: {
          path: "employee",
          select: "name email phone",
        },
      });
      const countPromise = claimRepository.count(filter);

      const [claims, totalCount] = await Promise.all([
        claimsPromise,
        countPromise,
      ]);

      return {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        currentPage: pageNumber,
        claims,
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

module.exports = ClaimService;
