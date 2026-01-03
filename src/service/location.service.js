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

      const toRad = (value) => (value * Math.PI) / 180;
      const calculateDist = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const MIN_DISTANCE_THRESHOLD = 0.02;
      const MAX_SEGMENT_DISTANCE = 0.5;
      const MAX_SPEED_KMH = 20;

      let totalDistance = 0;
      let anchorPoint = locations[0];

      for (let i = 1; i < locations.length; i++) {
        const currentPoint = locations[i];

        const timeDiffMs =
          currentPoint.deviceTimestamp - anchorPoint.deviceTimestamp;
        if (timeDiffMs <= 0) {
          anchorPoint = currentPoint;
          continue;
        }

        const dist = calculateDist(
          anchorPoint.latitude,
          anchorPoint.longitude,
          currentPoint.latitude,
          currentPoint.longitude
        );

        const timeDiffHours = timeDiffMs / 3600000;
        const speed = dist / timeDiffHours;

        const isValidMovement =
          dist >= MIN_DISTANCE_THRESHOLD &&
          dist <= MAX_SEGMENT_DISTANCE &&
          speed <= MAX_SPEED_KMH;

        if (isValidMovement) {
          totalDistance += dist;
        }
        anchorPoint = currentPoint;
      }

      const finalDistance = parseFloat(totalDistance.toFixed(2));
      const totalFare = Math.round(finalDistance * perKmFare);
      return {
        totalDistance: finalDistance,
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
