const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app.error");
const {
  LocationRepository,
  AttendanceRepository,
  SettingRepository,
} = require("../repository");

const locationRepository = new LocationRepository();
const attendanceRepository = new AttendanceRepository();
const settingRepository = new SettingRepository();

class LocationService {
  async create(params) {
    try {
      const checkEmployeeAttendance = await attendanceRepository.findOne({
        employee: params.employee,
        date: new Date(new Date(new Date()).setHours(0, 0, 0, 0)),
      });
      if (!checkEmployeeAttendance) {
        throw new AppError(
          "Employee has not checked in today. Cannot record location.",
          StatusCodes.BAD_REQUEST
        );
      }
      if (checkEmployeeAttendance.checkOutTime) {
        throw new AppError(
          "Employee has already checked out today. Cannot record location.",
          StatusCodes.BAD_REQUEST
        );
      }
      const response = await locationRepository.create(params);
      return response;
    } catch (error) {
      console.log(error, "<<< Error in Location Service");

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

  async getEmployeeLocation(params) {
    try {
      const { employeeId, date } = params;
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
      const locations = await locationRepository.find(filter, {
        sort: { createdAt: -1 },
        populate: {
          path: "employee",
          select: "name email phone",
        },
      });
      return locations;
    } catch (error) {
      console.log(error, "<<< Error in Admin Service getEmployeeLocations");
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ["Internal Server Error"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async calculateDistanceAndCalculate(params) {
    try {
      const { perKmFare } = await settingRepository.findOne({});

      const filter = { employee: params.employee };
      const targetDate = params.date;
      const startDate = new Date(targetDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(targetDate);
      endDate.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };

      const locations = await locationRepository.find(filter, {
        sort: { createdAt: 1 },
      });

      let totalDistance = 0;
      const calculateDist = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      for (let i = 0; i < locations.length - 1; i++) {
        const loc1 = locations[i];
        const loc2 = locations[i + 1];
        totalDistance += calculateDist(
          loc1.latitude,
          loc1.longitude,
          loc2.latitude,
          loc2.longitude
        );
      }

      totalDistance = Math.round(totalDistance * 100) / 100;
      const totalFare = Math.round(totalDistance * perKmFare);
      return {
        totalDistance: totalDistance,
        totalFare: totalFare,
        perKmFare: perKmFare,
      };
    } catch (error) {
      console.log(error, "<<< Error in Location Service calculateFare");
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
module.exports = LocationService;
