const express = require("express");
const tmHolidayController = require("../controllers/tm-holiday-controller");
const router = express.Router();

router.get("/fetch-holiday", tmHolidayController.fetchHoliday);
router.put("/update-holiday", tmHolidayController.updateHoliday);

module.exports = router;