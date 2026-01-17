const { StatusCodes } = require("http-status-codes");
const {
  EmployeeRepository,
  AttendanceRepository,
  LeaveRepository,
} = require("../repository");
const AppError = require("../utils/errors/app.error");
const { Auth } = require("../utils/common");
const employeeRepository = new EmployeeRepository();
const attendanceRepository = new AttendanceRepository();
const leaveRepository = new LeaveRepository();
const bcrypt = require("bcryptjs");
const ExcelJS = require("exceljs");

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
          StatusCodes.CONFLICT,
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
        StatusCodes.INTERNAL_SERVER_ERROR,
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
      if (params.status) {
        filter.status = params.status;
      }

      const limitNumber = parseInt(limit, 10) || 10;
      const pageNumber = parseInt(page, 10) || 1;
      const skip = (pageNumber - 1) * limitNumber;

      const opts = {
        limit: limitNumber,
        skip: skip,
        sort: { createdAt: -1 },
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
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(id) {
    try {
      const employee = await employeeRepository.findById(id, {
        select: "-password",
        populate: {
          path: "department",
          select: "name",
        },
      });
      if (!employee) {
        throw new AppError(
          "No employee found with the corresponding details.",
          StatusCodes.NOT_FOUND,
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
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(params) {
    try {
      const checkIfEmployeeExists = await employeeRepository.findOne({
        phone: params.phone,
      });
      if (!checkIfEmployeeExists) {
        throw new AppError(
          "No employee found with the given phone number.",
          StatusCodes.NOT_FOUND,
        );
      }

      const comparePassword = await checkIfEmployeeExists.comparePassword(
        params.password,
      );

      if (!comparePassword) {
        throw new AppError(
          "The password you have entered is incorrect.",
          StatusCodes.UNAUTHORIZED,
        );
      }

      if (checkIfEmployeeExists.phone === params.phone && comparePassword) {
        const token = await checkIfEmployeeExists.generateJWTToken();
        return token;
      } else {
        throw new AppError(
          "Invalid phone number or password.",
          StatusCodes.UNAUTHORIZED,
        );
      }
    } catch (error) {
      console.log(error, "<<< Error in Employee Service");

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        throw new AppError(
          `An account with this ${field}(${value}) already exists.`,
          StatusCodes.CONFLICT,
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
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStatus(params) {
    try {
      if (
        params.status != "ACTIVE" &&
        params.status != "INACTIVE" &&
        params.status != "RESIGNED"
      ) {
        throw new AppError(
          "Invalid status value provided.",
          StatusCodes.BAD_REQUEST,
        );
      }
      const response = await employeeRepository.updateById(params.id, {
        status: params.status,
      });
      if (!response) {
        throw new AppError(
          "No employee found with the corresponding details.",
          StatusCodes.NOT_FOUND,
        );
      }
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Employee Service");

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        throw new AppError(
          `A Employee with this ${field}(${value}) already exists.`,
          StatusCodes.CONFLICT,
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
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDetails(id, params) {
    try {
      const response = await employeeRepository.updateById(id, params);
      if (!response) {
        throw new AppError(
          "No employee found with the corresponding details.",
          StatusCodes.NOT_FOUND,
        );
      }
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Employee Service");

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        throw new AppError(
          `A Employee with this ${field}(${value}) already exists.`,
          StatusCodes.CONFLICT,
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
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePassword(id, params) {
    try {
      const response = await employeeRepository.updateById(id, {
        password: await bcrypt.hash(params.password, 10),
      });
      if (!response) {
        throw new AppError(
          "No employee found with the corresponding details.",
          StatusCodes.NOT_FOUND,
        );
      }
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Employee Service");

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        throw new AppError(
          `A Employee with this ${field}(${value}) already exists.`,
          StatusCodes.CONFLICT,
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
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDashboardDetails() {
    try {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const todayDate = new Date(new Date().setHours(0, 0, 0, 0));

      const presentEmployeesCount = await attendanceRepository.count({
        date: todayDate,
      });

      const leaveEmployeesCount = await leaveRepository.count({
        startDate: { $lte: endOfToday },
        endDate: { $gte: startOfToday },
        status: "Approved",
      });

      const absentEmployeesAggregation = await employeeRepository.aggregate([
        {
          $match: { status: "ACTIVE" },
        },
        {
          $lookup: {
            from: "attendances",
            let: { empId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$employee", "$$empId"] },
                      { $eq: ["$date", todayDate] },
                    ],
                  },
                },
              },
            ],
            as: "attendanceRecord",
          },
        },
        {
          $lookup: {
            from: "leaves",
            let: { empId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$employee", "$$empId"] },
                      { $eq: ["$status", "Approved"] },
                      { $lte: ["$startDate", endOfToday] },
                      { $gte: ["$endDate", startOfToday] },
                    ],
                  },
                },
              },
            ],
            as: "leaveRecord",
          },
        },
        {
          $match: {
            attendanceRecord: { $size: 0 },
            leaveRecord: { $size: 0 },
          },
        },
        {
          $project: {
            name: 1,
            email: 1,
            phone: 1,
          },
        },
      ]);

      const presentEmployees = await attendanceRepository.find(
        {
          date: todayDate,
        },
        {
          select:
            "-date -checkInTime -checkOutTime -totalDistance -perKmFare -totalFare -createdAt -updatedAt -__v",
          populate: {
            path: "employee",
            select: "name email phone",
          },
        },
      );

      const leaveEmployees = await leaveRepository.find(
        {
          startDate: { $lte: endOfToday },
          endDate: { $gte: startOfToday },
          status: "Approved",
        },
        {
          select:
            "-type -startDate -endDate -reason -response -status -createdAt -updatedAt -__v",
          populate: {
            path: "employee",
            select: "name email phone",
          },
        },
      );

      return {
        presentEmployeesCount,
        leaveEmployeesCount,
        absentEmployeesCount: absentEmployeesAggregation.length,
        presentEmployees,
        leaveEmployees,
        absentEmployees: absentEmployeesAggregation,
      };
    } catch (error) {
      console.log(error, "<<< Error in Employee Service getDashboardDetails");
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Internal Server Error",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async isAuthenticated(token) {
    try {
      const response = Auth.verifyToken(token);
      const employee = await this.getById(response.id);
      return employee;
    } catch (error) {
      console.log(error, "<<< Error in Employee Service isAuthenticated");
      if (error instanceof AppError) throw error;

      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        throw new AppError(
          "Invalid or expired authentication token provided.",
          StatusCodes.FORBIDDEN,
        );
      }

      throw new AppError(
        "Internal Server Error",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async exportToExcel(params) {
    try {
      const { startDate, endDate } = params;
      const filter = {};

      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
          filter.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = end;
        }
      }

      const employees = await employeeRepository.find(filter, {
        sort: { createdAt: -1 },
        populate: { path: "department", select: "name" },
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Employees");

      worksheet.columns = [
        { header: "Emp ID", key: "empId", width: 15 },
        { header: "Full Name", key: "name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Phone", key: "phone", width: 15 },
        { header: "Department", key: "department", width: 20 },
        { header: "Designation", key: "designation", width: 20 },
        { header: "Joining Date", key: "joiningDate", width: 15 },
        { header: "Status", key: "status", width: 12 },
        { header: "Created At", key: "createdAt", width: 20 },
      ];

      employees.forEach((emp) => {
        worksheet.addRow({
          empId: emp.empId,
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          department: emp.department ? emp.department.name : "N/A",
          designation: emp.designation,
          joiningDate: emp.joiningDate
            ? emp.joiningDate.toISOString().split("T")[0]
            : "N/A",
          status: emp.status,
          createdAt: emp.createdAt.toISOString().split("T")[0],
        });
      });

      return workbook;
    } catch (error) {
      console.log(error, "<<< Error in Employee Service exportToExcel");
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Internal Server Error",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

module.exports = EmployeeService;
