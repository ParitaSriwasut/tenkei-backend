const express = require("express");
const tmCsProgressController = require("../controllers/tm-csprogress-controller");
const router = express.Router();

router.get("/fetch-csprogress", tmCsProgressController.fetchCsProgress);

module.exports = router;