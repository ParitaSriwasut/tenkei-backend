const express = require("express");
const tmPlprogressController = require("../controllers/tm-plprogress-controller");
const router = express.Router();

router.get("/fetch-plprogress", tmPlprogressController.fetchPlprogress);

module.exports = router;