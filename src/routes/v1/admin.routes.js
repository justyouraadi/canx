const express = require('express');
const { AdminController } = require('../../controller');
const router = express.Router();

router.post("/",AdminController.create)
router.post("/signin",AdminController.signIn)

module.exports = router;