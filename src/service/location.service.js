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
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(targetDate);
      endDate.setUTCHours(23, 59, 59, 999);

      console.log(
        "Calculating distance for:",
        params.employee,
        startDate,
        endDate
      );

      filter.deviceTimestamp = {
        $gte: startDate,
        $lte: endDate,
      };

      const locations = await locationRepository.find(filter, {
        sort: { deviceTimestamp: 1 },
      });

      if (!locations || locations.length < 2) {
        return { totalDistance: 0, totalFare: 0, perKmFare };
      }

      const toRadians = (deg) => deg * (Math.PI / 180);
      const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth radius in KM

        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
      };

      let totalDistance = 0;

      for (let i = 1; i < locations.length; i++) {
        const prev = locations[i - 1];
        const curr = locations[i];

        const distance = calculateDistanceKm(
          prev.latitude,
          prev.longitude,
          curr.latitude,
          curr.longitude
        );

        // Ignore GPS noise below 20 meters
        // if (distance < 0.02) continue;

        totalDistance += distance;
      }

      totalDistance = Number(totalDistance.toFixed(2));
      const totalFare = Number((totalDistance * perKmFare).toFixed(2));

      return {
        totalDistance, // KM
        totalFare,
        perKmFare,
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
