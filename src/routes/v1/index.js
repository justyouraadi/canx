const express = require('express');
const router = express.Router();
const AdminRoutes = require('./admin.routes');

router.use("/admin", AdminRoutes);

module.exports = router;