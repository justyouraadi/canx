const express = require('express');
const { AttendanceController } = require('../../controller');
const { AuthMiddleware } = require('../../middleware');
const router = express.Router();

router.post('/', AuthMiddleware.checkEmpAuth,AttendanceController.create)

module.exports = router;