const express = require("express");
const tmProcessController = require("../controllers/tm-process-controller");
const router = express.Router();

router.get("/fetch-process", tmProcessController.fetchProcess);
router.get("/fetch-qmprocess", tmProcessController.QM_Process);

module.exports = router;