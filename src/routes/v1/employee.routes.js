const express = require("express");
const { EmployeeController } = require("../../controller");
const router = express.Router();

router.post("/", EmployeeController.create);
router.get("/", EmployeeController.getAll);
router.get("/:id", EmployeeController.getById);
router.post("/signin",EmployeeController.signIn)

module.exports = router;
