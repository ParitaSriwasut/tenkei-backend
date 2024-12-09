const express = require("express");
const tmCostController = require("../controllers/td-cost-controller");
const router = express.Router();

router.post("/cost-part", tmCostController.Search_Parts_No_AfterUpdate);
router.post("/cost-no", tmCostController.Search_Cost_No_AfterUpdate);
router.put("/cost-update", tmCostController.updateCost);
router.post("/cost-add", tmCostController.createCost);

module.exports = router;