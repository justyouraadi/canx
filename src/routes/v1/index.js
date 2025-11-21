const express = require('express');
const router = express.Router();
const AdminRoutes = require('./admin.routes');
const DepartmentRoutes = require('./department.routes');
const EmployeeRoutes = require('./employee.routes');
const AttendanceRoutes = require('./attendance.routes');

router.use("/admin", AdminRoutes);
router.use("/departments", DepartmentRoutes);
router.use("/employees", EmployeeRoutes);
router.use("/attendance", AttendanceRoutes);

module.exports = router;