const express = require("express");
const tmProcessController = require("../controllers/tm-process-controller");
const router = express.Router();

router.get("/fetch-process", tmProcessController.fetchProcess);
router.get("/fetch-all-process", tmProcessController.fetchAllProcess);
router.put("/update-process", tmProcessController.updateProcess);
router.get("/fetch-qmprocess", tmProcessController.QM_Process);
router.get("/fetch-processC", tmProcessController.fetchProcessCost);
module.exports = router;