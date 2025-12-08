const express = require("express");
const { AttendanceController } = require("../../controller");
const { AuthMiddleware } = require("../../middleware");
const router = express.Router();

router.get("/monthly",
  AuthMiddleware.checkEmpAuth,
  AttendanceController.getEmployeeMonthlyAttendance
)
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

router.get("/month/app/employee",AuthMiddleware.checkEmpAuth,AttendanceController.getEmployeeMonthlyAttendanceForApp)

router.get("/validate/checkin",
  AuthMiddleware.checkEmpAuth,
  AttendanceController.checkTodayCheckedIn
)

router.get("/admin/employee/:employee",
  // AuthMiddleware.checkAdminAuth,
  AttendanceController.getEmployeeAttendanceForAdmin
)


router.get("/month/admin/employee/:employee",
  // AuthMiddleware.checkAdminAuth,
  AttendanceController.getEmployeeMonthlyAttendanceForAdmin
)

module.exports = router;
