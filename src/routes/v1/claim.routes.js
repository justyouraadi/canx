const express = require("express");
const { ClaimController } = require("../../controller");
const { Upload } = require("../../utils/common");
const { AuthMiddleware } = require("../../middleware");
const router = express.Router();

router.post(
  "/",
  Upload.single("bill"),
  AuthMiddleware.checkEmpAuth,
  ClaimController.create
);
router.patch("/", ClaimController.replyOnClaim);
router.get(
  "/",
  AuthMiddleware.checkEmpAuth,
  ClaimController.getAllEmployeeClaims
);
router.get("/admin", ClaimController.getForAdmin);

module.exports = router;
