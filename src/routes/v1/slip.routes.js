const express = require("express");
const { SlipController } = require("../../controller");
const router = express.Router();

router.post("/", SlipController.generateSlip);

module.exports = router;
