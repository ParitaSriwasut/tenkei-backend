const express = require("express");
const tdPlanppcController = require("../controllers/tt-plan-ppc-controller");
const router = express.Router();

router.get("/fetch-planppc", tdPlanppcController.fetchplanppc);

module.exports = router;