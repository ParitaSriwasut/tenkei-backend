const express = require("express");
const tmCostListController = require("../controllers/td-costlist-controller");
const router = express.Router();

router.post("/costlist-detail", tmCostListController.Show_action);

module.exports = router;