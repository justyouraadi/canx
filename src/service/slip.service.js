const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app.error");
const { SlipRepository } = require("../repository");
const { EmployeeService, AttendanceService } = require(".");
const { SlipTemplates } = require("../templates");
const { default: axios } = require("axios");
const path = require("path");
const fs = require("fs");

const slipRepository = new SlipRepository();
const employeeService = new EmployeeService();
const attendanceService = new AttendanceService();

class SlipService {
  async generateSlip(params) {
    try {
      const checkIfSlipExists = await slipRepository.findOne({
        employee: params.employee,
        month: params.month,
        year: params.year,
      });

      if (checkIfSlipExists) {
        throw new AppError(
          "Slip for this employee for the given month and year already exists.",
          StatusCodes.CONFLICT
        );
      }

      const getMetaOfSlip = await attendanceService.monthAttendanceCount({
        employee: params.employee,
        month: params.month,
        year: params.year,
      });

      const getEmployeeDetails = await employeeService.getById(params.employee);
      params.travelAllowance = getMetaOfSlip.totalTravelAllowance;
      params.workingDays = getMetaOfSlip.totalPresentDays;
      params.claimsAmount = getMetaOfSlip.totalClaimsAmount;
      params.grossSalary =
        getEmployeeDetails.baseSalary +
        params.bonus +
        params.travelAllowance +
        params.claimsAmount;
      params.netSalary = params.grossSalary - params.deductions;

      const html = SlipTemplates.generateSlip({
        employee: getEmployeeDetails,
        month: params.month,
        year: params.year,
        day: new Date().getDate(),
        workingDays: params.workingDays,
        travelAllowance: params.travelAllowance,
        claimsAmount: params.claimsAmount,
        bonus: params.bonus,
        deductions: params.deductions,
        grossSalary: params.grossSalary,
        netSalary: params.netSalary,
      });

      const pdfResponse = await axios.post(
        "https://apdf.io/api/pdf/file/create",
        {
          html,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer L7GSiUBytcXR0UXD9vW5fAmhRFncGvYNUI5H3gRYf2afa5ec`,
          },
        }
      );

      const pdfUrl = pdfResponse.data.file;

      if (!pdfUrl) {
        throw new AppError(
          "Failed to generate PDF slip.",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const downloadResponse = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
      });
      const pdfBuffer = Buffer.from(downloadResponse.data);

      const uploadDir = path.join(process.cwd(), "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `salary-slip-${uniqueSuffix}.pdf`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, pdfBuffer);

      params.slipFileUrl = fileName;

      const response = await slipRepository.create(params);
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Slip Service");
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        throw new AppError(
          `A Slip with this ${field}(${value}) already exists.`,
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

  async updateStatus(params) {
    try {
      if (params.status != "Draft" && params.status != "Generated") {
        throw new AppError(
          "Invalid status value provided.",
          StatusCodes.BAD_REQUEST
        );
      }
      const response = await slipRepository.updateById(params.id, {
        status: params.status,
      });
      if (!response) {
        throw new AppError(
          "No employee found with the corresponding details.",
          StatusCodes.NOT_FOUND
        );
      }
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Slip Service");

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
      const { page, limit, status, date } = params;
      const filter = {};
      if (status) {
        filter.status = status;
      }

      if (date) {
        const inputDate = new Date(date);
        const startDate = new Date(
          inputDate.getFullYear(),
          inputDate.getMonth(),
          1,
          0,
          0,
          0,
          0
        );

        const endDate = new Date(
          inputDate.getFullYear(),
          inputDate.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );

        filter.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const limitNumber = parseInt(limit, 10) || 10;
      const pageNumber = parseInt(page, 10) || 1;
      const skip = (pageNumber - 1) * limitNumber;

      const opts = {
        limit: limitNumber,
        skip: skip,
        sort: { createdAt: -1 },
      };

      const dataPromise = slipRepository.find(filter, {
        ...opts,
        populate: {
          path: "employee",
          select: "name email phone",
        },
      });
      const countPromise = slipRepository.count(filter);

      const [data, totalCount] = await Promise.all([dataPromise, countPromise]);
      return {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        currentPage: pageNumber,
        slips: data,
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

  async getForParticularEmployee(params) {
    try {
      const { page, limit, employee, date } = params;
      const filter = {
        employee: employee,
        status: "Generated",
      };

      if (date) {
        const inputDate = new Date(date);
        const month = inputDate.getMonth() + 1;
        const year = inputDate.getFullYear();

        filter.month = month;
        filter.year = year;
      }

      const limitNumber = parseInt(limit, 10) || 10;
      const pageNumber = parseInt(page, 10) || 1;
      const skip = (pageNumber - 1) * limitNumber;

      const opts = {
        limit: limitNumber,
        skip: skip,
        sort: { createdAt: -1 },
      };

      const dataPromise = slipRepository.find(filter, {
        ...opts,
        populate: {
          path: "employee",
          select: "name email phone",
        },
      });
      const countPromise = slipRepository.count(filter);

      const [data, totalCount] = await Promise.all([dataPromise, countPromise]);
      return {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        currentPage: pageNumber,
        slips: data,
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
}

module.exports = SlipService;
