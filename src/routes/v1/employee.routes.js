const express = require("express");
const { EmployeeController } = require("../../controller");
const router = express.Router();

router.post("/", EmployeeController.create);
router.get("/", EmployeeController.getAll);

module.exports = router;
