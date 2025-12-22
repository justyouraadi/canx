const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app.error");
const { SlipRepository } = require("../repository");
const { EmployeeService, AttendanceService } = require(".");

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
      params.grossSalary = getEmployeeDetails.baseSalary + params.bonus + params.travelAllowance;
      params.netSalary = params.grossSalary - params.deductions;


      

      // const response = await slipRepository.create(params);
      return true;
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
}

module.exports = SlipService;
