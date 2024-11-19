const express = require("express");
const tmScheduleController = require("../controllers/tm-schedule-controller");
const router = express.Router();

router.get("/fetch-schedule", tmScheduleController.fetchSchedule);

module.exports = router;