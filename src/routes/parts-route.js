const express = require("express");
const tmPartsController = require("../controllers/tm-parts-controller");
const router = express.Router();

router.get("/fetch-parts", tmPartsController.fetchParts);

module.exports = router;