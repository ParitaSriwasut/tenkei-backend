const express = require("express");
const tdPlanListController = require("../controllers/td-planlist-controller");
const router = express.Router();

router.get("/fetch-planlist",tdPlanListController.Show_action)

module.exports = router;