const express = require("express");
const { EmployeeController, LocationController } = require("../../controller");
const { AuthMiddleware } = require("../../middleware");
const router = express.Router();

router.post("/", EmployeeController.create);
router.get("/", EmployeeController.getAll);
router.get("/:id", EmployeeController.getById);
router.post("/signin", EmployeeController.signIn);
router.post(
  "/location",
  AuthMiddleware.checkEmpAuth,
  LocationController.create
);
router.get(
  "/location/:employeeId",
  // AuthMiddleware.checkEmpAuth,
  LocationController.getEmployeeLocation
);

module.exports = router;
