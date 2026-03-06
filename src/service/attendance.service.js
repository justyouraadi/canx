const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app.error");
const {
  AttendanceRepository,
  LeaveRepository,
  ClaimRepository,
} = require("../repository");
const LocationService = require("./location.service");
const { default: mongoose } = require("mongoose");

const attendanceRepository = new AttendanceRepository();
const claimsRepository = new ClaimRepository();
const leaveRepository = new LeaveRepository();
const locationService = new LocationService();

class AttendanceService {
  async create(params) {
    try {
      params.date = new Date(new Date(params.date).setHours(0, 0, 0, 0));
      const response = await attendanceRepository.create(params);
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Attendance Service");

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        throw new AppError(
          `An attendance with this ${field}(${value}) already exists.`,
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

  async checkOut(params) {
    try {
      const attendanceRecord = await attendanceRepository.findOne({
        employee: params.employee,
        date: new Date(new Date(new Date()).setHours(0, 0, 0, 0)),
      });
      if (!attendanceRecord) {
        throw new AppError(
          "Attendance record not found for check-out.",
          StatusCodes.NOT_FOUND
        );
      }

      if (attendanceRecord.checkOutTime) {
        throw new AppError(
          "Employee has already checked out for the day.",
          StatusCodes.BAD_REQUEST
        );
      }

      const { totalDistance, totalFare, perKmFare } =
        await locationService.calculateDistanceAndCalculate({
          employee: params.employee,
          date: new Date(),
        });

      const updatedRecord = await attendanceRepository.updateById(
        attendanceRecord._id,
        { checkOutTime: new Date(), totalDistance, totalFare, perKmFare }
      );

      if (!updatedRecord) {
        throw new AppError(
          "Failed to update attendance record for check-out.",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return updatedRecord;
    } catch (error) {
      console.log(error, "<<< Error in Attendance Service");

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        throw new AppError(
          `An attendance with this ${field}(${value}) already exists.`,
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

  async checkTodayCheckedIn(params) {
    try {
      const attendanceRecord = await attendanceRepository.findOne({
        employee: params.employee,
        date: new Date(new Date(new Date()).setHours(0, 0, 0, 0)),
      });
      if (!attendanceRecord) {
        throw new AppError(
          "Attendance record not found for check-out.",
          StatusCodes.NOT_FOUND
        );
      }

      return attendanceRecord;
    } catch (error) {
      console.log(error, "<<< Error in Attendance Service");

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ["Internal Server Error"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getEmployeeAttendanceForAdmin(params) {
    try {
      const date = new Date(params.date);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const response = await attendanceRepository.findOne({
        employee: params.employee,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });
      if (!response) {
        return {};
      }
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Attendance Service");

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ["Internal Server Error"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getEmployeeMonthlyAttendanceForAdmin(params) {
    try {
    const { employee, month, year } = params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const pipeline = [
  {
    $match: {
      employee: new mongoose.Types.ObjectId(employee),
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    },
  },
  {
    $sort: { date: 1 },
  },
  {
    $lookup: {
      from: "employees",
      localField: "employee",
      foreignField: "_id",
      as: "employee",
    },
  },
  {
    $unwind: "$employee",
  },
  {
    $project: {
      date: 1,
      checkInTime: 1,
      checkOutTime: 1,
      totalDistance: 1,
      totalFare: 1,
      perKmFare: 1,
      employee: {
        _id: "$employee._id",
        name: "$employee.name",
        email: "$employee.email",
        phone: "$employee.phone",
      },
    },
  },
  {
    $group: {
      _id: null,
      records: { $push: "$$ROOT" },
      totalDistance: { $sum: "$totalDistance" },
    },
  },
];

    const result = await attendanceRepository.aggregate(pipeline);

    return result[0] || { records: [], totalDistance: 0 };
    } catch (error) {
      console.log(error, "<<< Error in Attendance Service");

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ["Internal Server Error"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getEmployeeMonthlyAttendanceForApp(params) {
    try {
      const { employee, month, year } = params;
      const filter = { employee: employee };
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      filter.date = {
        $gte: startDate,
        $lte: endDate,
      };

      const response = await attendanceRepository.find(filter, {
        sort: { date: 1 },
        populate: {
          path: "employee",
          select: "name email phone",
        },
      });
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Attendance Service");

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ["Internal Server Error"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async monthAttendanceCount(params) {
    try {
      const { employee, month, year } = params;
      const filter = { employee: employee };
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      filter.date = {
        $gte: startDate,
        $lte: endDate,
      };

      const totalPresentDays = await attendanceRepository.count(filter);
      const totalLeaveDays = await leaveRepository.count({
        employee,
        createdAt: filter.date,
        status: "Approved",
      });
      const totalDaysInMonth = new Date(year, month, 0).getDate();
      const pipeline = await attendanceRepository.aggregate([
        {
          $match: {
            employee: new mongoose.Types.ObjectId(employee),
            date: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalFare: { $sum: "$totalFare" },
          },
        },
      ]);

      const claimsTotal = await claimsRepository.aggregate([
        {
          $match: {
            employee: new mongoose.Types.ObjectId(employee),
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
            status: "APPROVED",
          },
        },
        {
          $group: {
            _id: null,
            amount: { $sum: "$amount" },
          },
        },
      ]);

      const totalTravelAllowance =
        pipeline.length > 0 ? pipeline[0].totalFare : 0;

      return {
        totalPresentDays,
        totalLeaveDays,
        totalDaysInMonth,
        totalTravelAllowance,
        totalClaimsAmount: claimsTotal.length > 0 ? claimsTotal[0].amount : 0,
      };
    } catch (error) {
      console.log(error, "<<< Error in Attendance Service");

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ["Internal Server Error"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async autoCheckoutAll() {
    try {
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      const pendingAttendances = await attendanceRepository.find({
        date: today,
        checkOutTime: null,
      });

      console.log(
        `[Cron Job] Found ${pendingAttendances.length} pending checkouts.`
      );
      console.log(pendingAttendances);
      for (const attendance of pendingAttendances) {
        try {
          console.log(
            `[Cron Job] Auto-checking out attendance ID: ${attendance._id}`
          );
          await this.checkOut({ employee: attendance.employee });
          console.log(
            `[Cron Job] Successfully auto-checked out attendance ID: ${attendance._id}`
          );
        } catch (error) {
          console.log(
            `[Cron Job] Failed to auto-check out attendance ID: ${attendance._id}`,
            error
          );
        }
      }
      return pendingAttendances;
    } catch (error) {
      console.error("<<< Error in auto Attendance Service", error);
      throw new AppError(
        "Internal Server Error during auto-checkout",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = AttendanceService;
