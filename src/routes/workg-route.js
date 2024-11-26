const express = require("express");
const tmWorkgController = require("../controllers/tm-workg-controller");
const router = express.Router();

router.get("/fetch-workg", tmWorkgController.fetchWorkg);
router.put("/update-workg", tmWorkgController.updateworkG);

module.exports = router;