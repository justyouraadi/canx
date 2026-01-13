const express = require("express");
const { EmployeeController, LocationController } = require("../../controller");
const { AuthMiddleware } = require("../../middleware");
const { Upload } = require("../../utils/common");
const router = express.Router();

router.post("/", Upload.single("profile"), EmployeeController.create);
router.get("/", EmployeeController.getAll);
router.get("/:id", EmployeeController.getById);
router.get(
  "/get/profile",
  AuthMiddleware.checkEmpAuth,
  EmployeeController.getProfile
);
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
router.get("/get/location/app", AuthMiddleware.checkEmpAuth, LocationController.getEmployeeLocationForApp);
router.put("/status/update", EmployeeController.updateStatus);
router.patch("/details/update", EmployeeController.updateDetails);
router.put("/password/update", EmployeeController.updatePassword);
router.get("/dashboard/details", EmployeeController.getDashboardDetails);

module.exports = router;
