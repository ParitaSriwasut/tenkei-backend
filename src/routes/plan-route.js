const express = require("express");
const tdPlanController = require("../controllers/td-plan-controller");
const router = express.Router();

router.post("/search-order-plan", tdPlanController.Search_Order_No_AfterUpdate);
router.post("/search-part-plan", tdPlanController.Search_Parts_No_AfterUpdate);
router.put("/edits-plan", tdPlanController.editplan);
router.delete("/delete-plans", tdPlanController.deletePlans);
router.post("/graph", tdPlanController.graph);
router.post("/create-plan",tdPlanController.createPlan);
module.exports = router;