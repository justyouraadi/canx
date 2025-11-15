const express = require("express");
const { DepartmentController } = require("../../controller");
const router = express.Router();

router.post("/", DepartmentController.create);
router.get("/", DepartmentController.getAll);

module.exports = router;