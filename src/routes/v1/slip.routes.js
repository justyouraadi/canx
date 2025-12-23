const express = require("express");
const { SlipController } = require("../../controller");
const { AuthMiddleware } = require("../../middleware");
const router = express.Router();

router.post("/", SlipController.generateSlip);
router.get("/",SlipController.getAll)
router.get("/app/employee",AuthMiddleware.checkEmpAuth,SlipController.getForParticularEmployee)
router.put("/status/update", SlipController.updateStatus)

module.exports = router;
