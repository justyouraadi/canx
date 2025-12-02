const express = require("express");
const { OfflineController } = require("../../controller");
const { AuthMiddleware } = require("../../middleware");
const router = express.Router();

router.post("/", AuthMiddleware.checkEmpAuth, OfflineController.create);
router.get("/", AuthMiddleware.checkEmpAuth, OfflineController.getEmployeeOfflineDataForApp)
router.get("/admin/:employeeId",  OfflineController.getEmployeeOfflineDataForAdmin)

module.exports = router;
