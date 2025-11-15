const express = require("express");
const { EmployeeController } = require("../../controller");
const router = express.Router();

router.post("/", EmployeeController.create);
router.get("/", EmployeeController.getAll);
router.get("/:id", EmployeeController.getById);

module.exports = router;
