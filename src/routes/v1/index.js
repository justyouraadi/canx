const express = require('express');
const router = express.Router();
const AdminRoutes = require('./admin.routes');
const DepartmentRoutes = require('./department.routes');

router.use("/admin", AdminRoutes);
router.use("/departments", DepartmentRoutes);

module.exports = router;