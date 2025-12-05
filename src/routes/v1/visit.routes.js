const express = require("express");
const { VisitController } = require("../../controller");
const { AuthMiddleware } = require("../../middleware");
const router = express.Router();

router.post("/", AuthMiddleware.checkEmpAuth, VisitController.create);
router.get("/", AuthMiddleware.checkEmpAuth, VisitController.getAll);

module.exports = router;
