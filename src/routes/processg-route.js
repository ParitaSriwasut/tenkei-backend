const express = require("express");
const tmProcessGController = require("../controllers/tm-processg-controller");
const router = express.Router();

router.get("/fetch-processg", tmProcessGController.fetchProcessG);
router.put("/update-processg", tmProcessGController.updateProcessg);
router.get("/fetch-processg-plan", tmProcessGController.Show_action);

module.exports = router;