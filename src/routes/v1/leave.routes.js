const express = require("express");
const { LeaveController } = require("../../controller");
const { AuthMiddleware } = require("../../middleware");
const router = express.Router();

router.post("/", AuthMiddleware.checkEmpAuth, LeaveController.create);
router.patch("/", LeaveController.replyOnLeave);
router.get("/", AuthMiddleware.checkEmpAuth, LeaveController.getAll);
router.get("/admin", LeaveController.getAllForAdmin);

module.exports = router;
