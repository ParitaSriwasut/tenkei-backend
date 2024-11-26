const express = require("express");
const ttNavFGController = require("../controllers/nav-fg-controller");
const router = express.Router();

router.get("/fetch-navfg", ttNavFGController.fetchNAVFG);
router.get("/fetch-nonefg", ttNavFGController.NoneFG);
router.get("/fetch-nonefgtenkei", ttNavFGController.NoneFGTENKEI);
router.put("/update-navfg", ttNavFGController.updateNAVFG);

module.exports = router;