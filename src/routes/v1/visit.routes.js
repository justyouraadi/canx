const express = require("express");
const { VisitController } = require("../../controller");
const { AuthMiddleware } = require("../../middleware");
const { Upload } = require("../../utils/common");
const router = express.Router();

router.post("/", Upload.single("asset"), AuthMiddleware.checkEmpAuth, VisitController.create);
router.get("/", AuthMiddleware.checkEmpAuth, VisitController.getAll);
router.get("/admin/:id", VisitController.getForAdmin);
module.exports = router;
