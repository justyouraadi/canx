const express = require('express');
const router = express.Router();
const AdminRoutes = require('./admin.routes');
const DepartmentRoutes = require('./department.routes');
const EmployeeRoutes = require('./employee.routes');

router.use("/admin", AdminRoutes);
router.use("/departments", DepartmentRoutes);
router.use("/employees", EmployeeRoutes);

module.exports = router;