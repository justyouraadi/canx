const express = require("express");
const { SettingController } = require("../../controller");
const router = express.Router();

router.get("/",SettingController.getSettings);
router.patch("/",SettingController.updateSettings);

module.exports = router;