const express = require("express");
const ttNavWIController = require("../controllers/nav-wi-controller");
const router = express.Router();

router.get("/fetch-navwi", ttNavWIController.fetchNAVWI);
router.get("/fetch-nonewi", ttNavWIController.NoneWI);
router.get("/fetch-nonewitenkei", ttNavWIController.NoneWITENKEI);
router.put("/update-navwi", ttNavWIController.updateNAVWI);

module.exports = router;