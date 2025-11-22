const express = require("express");
const { AttendanceController } = require("../../controller");
const { AuthMiddleware } = require("../../middleware");
const router = express.Router();

router.post(
  "/checkin",
  AuthMiddleware.checkEmpAuth,
  AttendanceController.create
);
router.put(
  "/checkout",
  AuthMiddleware.checkEmpAuth,
  AttendanceController.checkOut
);

router.get("/validate/checkin",
  AuthMiddleware.checkEmpAuth,
  AttendanceController.checkTodayCheckedIn
)

router.get("/admin/employee/:employee",
  // AuthMiddleware.checkAdminAuth,
  AttendanceController.getEmployeeAttendanceForAdmin
)

module.exports = router;
