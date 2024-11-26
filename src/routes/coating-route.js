const express = require("express");
const tmCoatingController = require("../controllers/tm-coating-controller");
const router = express.Router();

router.get("/fetch-coating", tmCoatingController.fetchCoating);
router.put("/update-coating", tmCoatingController.updateCoating);

module.exports = router;