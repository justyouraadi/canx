const express = require('express');
const router = express.Router();
const AdminRoutes = require('./admin.routes');
const DepartmentRoutes = require('./department.routes');
const EmployeeRoutes = require('./employee.routes');
const AttendanceRoutes = require('./attendance.routes');
const SettingRoutes = require('./setting.routes');
const OfflineRoutes = require('./offline.routes');
const VisitRoutes = require('./visit.routes');

router.use("/admin", AdminRoutes);
router.use("/departments", DepartmentRoutes);
router.use("/employees", EmployeeRoutes);
router.use("/attendance", AttendanceRoutes);
router.use("/settings", SettingRoutes);
router.use("/offline",OfflineRoutes);
router.use("/visits",VisitRoutes);

module.exports = router;