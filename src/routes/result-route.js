const express = require("express");
const tmResultController = require("../controllers/td-result-controller");
const router = express.Router();

router.post("/result-plan", tmResultController.Search_Parts_No_AfterUpdate);

module.exports = router;